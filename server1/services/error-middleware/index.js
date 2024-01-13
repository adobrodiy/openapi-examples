import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import config from '../../services/config/index.js';
import logger from '../../services/logger/index.js';
import buildRouter from '../../services/build-router/index.js';

const factory = (
  config,
  logger,
  buildRouter
) => {
  return () => {
    return (error, req, res, next) => {
      config.showErrorStackTrace;
      const respData = {
        status: 500,
        message: 'Unexpected error'
      };
      if (error instanceof buildRouter.errors.SecurityCheckFailed) {
        respData.status = 401;
        respData.message = 'Unauthorized';
        if (config.showErrorStackTrace) {
          respData.errorMessage = error.message;
        }
      } else if (error instanceof buildRouter.errors.RequestValidationError) {
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
  buildRouter
];
factory[singleton] = true;
export default factory;
