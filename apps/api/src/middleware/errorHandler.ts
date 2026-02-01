import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorLoggingService } from '../services/errorLoggingService.js';
import { AuthRequest } from './auth.js';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any = undefined;

  // Log error with context
  const authReq = req as AuthRequest;
  errorLoggingService.logErrorFromRequest(error as Error, req, authReq.user);

  // Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
  }
  // Custom app errors
  else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Prisma errors
  else if (error.message.includes('Unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
  }
  else if (error.message.includes('Record to update not found')) {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};