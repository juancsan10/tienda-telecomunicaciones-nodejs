import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[ERROR] ${err.message}`);
  if (isDev) console.error(err.stack);

  res.status(500).json({
    error: isDev ? err.message : 'Internal server error',
  });
}
