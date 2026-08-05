import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { sendResponse } from '../../utils/response.util';
import { AppError } from '../../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials are standard
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn('⚠️ Uploads dir creation notice:', e);
}

// ─── Helper function to resolve absolute HTTPS image URL ───────────────────────
const getPublicFileUrl = (req: Request, filename: string): string => {
  const envUrl = process.env.APP_URL || process.env.BACKEND_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    const cleanBase = envUrl.replace(/\/$/, '').replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
    return `${cleanBase}/uploads/${filename}`;
  }

  const forwardedProto = req.headers['x-forwarded-proto'] as string;
  const isHttps = forwardedProto === 'https' || req.secure || process.env.NODE_ENV === 'production';
  const protocol = isHttps ? 'https' : (req.protocol || 'http');

  const forwardedHost = req.headers['x-forwarded-host'] as string;
  let host = forwardedHost || req.get('host') || 'localhost:5000';

  if ((host.includes('localhost') || host.includes('127.0.0.1')) && process.env.NODE_ENV === 'production') {
    const origin = req.headers.origin || req.headers.referer || process.env.CLIENT_URL;
    if (origin) {
      try {
        const parsedUrl = new URL(origin);
        return `${parsedUrl.protocol}//${parsedUrl.host}/uploads/${filename}`;
      } catch (_) {}
    }
  }

  return `${protocol}://${host}/uploads/${filename}`;
};

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided.', 400));
    }

    // 1. If Cloudinary is configured, upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
      try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'dohssheba',
        });
        return sendResponse(res, 200, 'Image uploaded successfully', {
          url: result.secure_url,
          publicId: result.public_id,
        });
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload failed, falling back to disk/dataURI:', cloudErr);
      }
    }

    // 2. Try Disk Storage
    try {
      const ext = req.file.mimetype.split('/')[1] || 'jpg';
      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, req.file.buffer);

      const fileUrl = getPublicFileUrl(req, filename);
      return sendResponse(res, 200, 'Image processed successfully', {
        url: fileUrl,
      });
    } catch (diskErr) {
      console.warn('⚠️ Local disk write failed, returning Data URI fallback:', diskErr);
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      return sendResponse(res, 200, 'Image processed successfully', {
        url: dataURI,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next(new AppError('No image files provided.', 400));
    }

    const urls: string[] = [];

    for (const file of files) {
      let uploadedUrl = '';
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
        try {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'dohssheba',
          });
          uploadedUrl = result.secure_url;
        } catch (_) {}
      }

      if (!uploadedUrl) {
        try {
          const ext = file.mimetype.split('/')[1] || 'jpg';
          const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
          const filepath = path.join(uploadsDir, filename);
          fs.writeFileSync(filepath, file.buffer);
          uploadedUrl = getPublicFileUrl(req, filename);
        } catch (_) {
          const b64 = Buffer.from(file.buffer).toString('base64');
          uploadedUrl = `data:${file.mimetype};base64,${b64}`;
        }
      }

      urls.push(uploadedUrl);
    }

    return sendResponse(res, 200, 'Images uploaded successfully', { urls });
  } catch (error) {
    next(error);
  }
};
