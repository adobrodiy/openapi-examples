import winston from 'winston';
import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import config from '../../services/config/index.js';

const factory = (winston, config) => {
  const { createLogger, transports, format } = winston;

  const logger = createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.align(),
          format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack ? '\n' + info.stack : ''}`)
        ),
        level: config.logLevel
      })
    ]
  });

  return logger;
};
factory[dependencies] = [winston, config];
factory[singleton] = true;
export default factory;