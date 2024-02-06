export const Logger = (name: string, enabled: boolean = false) => {
  if (!enabled) {
    return {
      debug: () => {},
      error: () => {},
      info: () => {},
      log: () => {},
      trace: () => {},
      warn: () => {},
    };
  }

  return console;
};

export type Logger = typeof console;

export const handleError = (logger: Logger, message?: string) => (error: Error) => {
  logger.error(error.message);
  throw new Error(`Error Occurred: ${message ?? error.message}`);
};

export const handleDebug = (logger: Logger, message?: string) => (res: any) => {
  logger.debug(message, res);
  return res;
};
