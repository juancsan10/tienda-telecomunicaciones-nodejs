import app from './app';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/health`);
  logger.info(`API v1: http://localhost:${PORT}/api/v1/products`);
});

function shutdown(signal: string): void {
  logger.info(`${signal} recibido, cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Servidor y conexión a base de datos cerrados');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
