import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { ErrorResponse } from '../types';
import { logger } from '../config/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDev = process.env['NODE_ENV'] !== 'production';

  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      error: 'Validation Error',
      message: 'Los datos enviados no son válidos',
      issues: err.issues,
    };
    res.status(400).json(response);
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} - ${err.message}`);
    const response: ErrorResponse = { error: 'Request Error', message: err.message };
    res.status(err.statusCode).json(response);
    return;
  }

  logger.error(`[Unhandled] ${err.message}${isDev && err.stack ? `\n${err.stack}` : ''}`);
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: isDev ? err.message : 'Ocurrió un error inesperado',
  };
  res.status(500).json(response);
}
