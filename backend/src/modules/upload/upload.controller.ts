import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { sendResponse } from '../../utils/response.util';
import { AppError } from '../../middlewares/error.middleware';

// Configure Cloudinary if credentials are standard
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided.', 400));
    }

    // If Cloudinary is configured, upload to Cloudinary; otherwise return base64 / mock URL
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'dohssheba',
      });
      return sendResponse(res, 200, 'Image uploaded successfully', {
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    // Local Disk Storage Fallback
    const ext = req.file.mimetype.split('/')[1] || 'jpg';
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, req.file.buffer);

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    return sendResponse(res, 200, 'Image processed successfully', {
      url: fileUrl,
    });
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

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';

    for (const file of files) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name') {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'dohssheba',
        });
        urls.push(result.secure_url);
      } else {
        const ext = file.mimetype.split('/')[1] || 'jpg';
        const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, file.buffer);
        urls.push(`${protocol}://${host}/uploads/${filename}`);
      }
    }

    return sendResponse(res, 200, 'Images uploaded successfully', { urls });
  } catch (error) {
    next(error);
  }
};
