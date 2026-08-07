import { Request, Response, NextFunction } from 'express';
import * as technicianService from './technician.service';
import { sendResponse } from '../../utils/response.util';

export const getTechnicians = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const technicians = await technicianService.getTechnicians();
    return sendResponse(res, 200, 'Technicians fetched', technicians);
  } catch (error) {
    next(error);
  }
};

export const getActiveTechnicians = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const technicians = await technicianService.getActiveTechnicians();
    return sendResponse(res, 200, 'Active technicians fetched', technicians);
  } catch (error) {
    next(error);
  }
};

export const createTechnician = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const technician = await technicianService.createTechnician(req.body);
    return sendResponse(res, 201, 'Technician created successfully', technician);
  } catch (error) {
    next(error);
  }
};

export const updateTechnician = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const technician = await technicianService.updateTechnician(id, req.body);
    return sendResponse(res, 200, 'Technician updated successfully', technician);
  } catch (error) {
    next(error);
  }
};

export const deleteTechnician = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await technicianService.deleteTechnician(id);
    return sendResponse(res, 200, 'Technician deactivated successfully');
  } catch (error) {
    next(error);
  }
};
