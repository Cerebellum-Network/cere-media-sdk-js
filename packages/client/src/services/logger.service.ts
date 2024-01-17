import PinoLogger from 'pino';
import Pretty from 'pino-pretty';

export const Logger = (name: string, enabled: boolean = false) => {
  return PinoLogger(
    Pretty({
      colorize: true,
      translateTime: true,
      ignore: 'pid,hostname',
    }),
  );
};

export type Logger = PinoLogger.Logger;

export const handleError = (logger: Logger, message?: string) => (error: Error) => {
  logger.error(error.message);
  throw new Error(`Error Occurred: ${message ?? error.message}`);
};
