export const Logger = (name: string, enabled: boolean = false) => {
  if (typeof window !== 'undefined') {
    // Browser logger
    return console;
  }

  const PinoLogger = require('pino');
  const Pretty = require('pino-pretty');

  return PinoLogger(
    Pretty({
      colorize: true,
      translateTime: true,
      ignore: 'pid,hostname',
    }),
  );
};

export type Logger = typeof console;

export const handleError = (logger: Logger, message?: string) => (error: Error) => {
  logger.error(error.message);
  throw new Error(`Error Occurred: ${message ?? error.message}`);
};
