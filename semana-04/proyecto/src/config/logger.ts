import winston from 'winston';
import morgan from 'morgan';

const isProd = process.env['NODE_ENV'] === 'production';

export const logger = winston.createLogger({
  level: isProd ? 'warn' : 'http',
  format: isProd
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`),
      ),
  transports: [new winston.transports.Console()],
});

if (isProd) {
  logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
}

export const morganMiddleware = morgan(isProd ? 'combined' : 'dev', {
  stream: {
    write: (message: string) => logger.http(message.trim()),
  },
});
