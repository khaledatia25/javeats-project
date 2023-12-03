import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// date + logger level + message
const dateFormat = (): string => {
  return new Date(Date.now()).toLocaleString();
};

class LoggerService {
  private route: string;
  private logger: winston.Logger;

  constructor(route: string) {
    this.route = route;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
          info.message
        }`;
        message = info.obj
          ? message + `data ${JSON.stringify(info.obj)}`
          : message;
        return message;
      }),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${process.env.LOG_FILE_PATH}/${this.route}.log `,
        }),
      ],
    });
  }

  async info(message: string, obj?: unknown): Promise<void> {
    if (obj) {
      console.log(obj);
      this.logger.log('info', message, { obj });
    } else {
      this.logger.log('info', message);
    }
  }

  async error(message: string, obj?: unknown): Promise<void> {
    if (obj) {
      this.logger.log('error', message, { obj });
    } else {
      this.logger.log('error', message);
    }
  }

  async debug(message: string, obj?: unknown): Promise<void> {
    if (obj) {
      this.logger.log('debug', message, { obj });
    } else {
      this.logger.log('debug', message);
    }
  }
}

export default LoggerService;
