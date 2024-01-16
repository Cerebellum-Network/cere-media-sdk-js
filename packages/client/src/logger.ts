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
