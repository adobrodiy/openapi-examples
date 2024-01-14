import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import config from '../../services/config/index.js';
import logger from '../../services/logger/index.js';
import buildSecurity from '../../services/build-security/index.js';

const factory = (
  config,
  logger,
  buildSecurity
) => {
  return () => {
    return (error, req, res, next) => {
      config.showErrorStackTrace;
      const respData = {
        status: 500,
        message: 'Unexpected error'
      };
      // security validation
      if (error instanceof buildSecurity.errors.Unauthorized) {
        respData.status = 401;
        respData.message = 'Unauthorized';
        if (config.showErrorStackTrace) {
          respData.errorMessage = error.message;
        }
      } else if (error.status === 400) {
        respData.status = 400;
        respData.message = 'Bad request';
        respData.errors = error.errors;
      } else {
        logger.info(`Unexpected error. ${error.message}`);
        logger.error('Unexpected error. ', error);
      }
      if (config.showErrorStackTrace) {
        respData.trace = error.stack;
      }
      return res.status(respData.status).json(respData);
    };
  };
};
factory[dependencies] = [
  config,
  logger,
  buildSecurity
];
factory[singleton] = true;
export default factory;
