import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDev = process.env['NODE_ENV'] !== 'production';

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Los datos enviados no son válidos',
      issues: err.issues,
    });
    return;
  }

  // Errores conocidos de Prisma (constraint, registro no encontrado, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Not Found', message: 'Recurso no encontrado' });
      return;
    }
    if (err.code === 'P2002') {
      const target = (err.meta?.['target'] as string[] | undefined)?.join(', ') ?? 'campo único';
      res.status(409).json({ error: 'Conflict', message: `Ya existe un registro con ese ${target}` });
      return;
    }
  }

  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} - ${err.message}`);
    res.status(err.statusCode).json({ error: 'Request Error', message: err.message });
    return;
  }

  logger.error(`[Unhandled] ${err.message}${isDev && err.stack ? `\n${err.stack}` : ''}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDev ? err.message : 'Ocurrió un error inesperado',
  });
}
