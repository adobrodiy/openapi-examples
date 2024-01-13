import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import express from 'express';
import securityPackage from 'openapi-security-handler';
import requestValidatorPackage from 'openapi-request-validator';
import logger from '../../services/logger/index.js';

const OpenAPISecurityHandler = securityPackage.default;
const OpenAPIRequestValidator = requestValidatorPackage.default

const factory = (
  express,
  OpenAPISecurityHandler,
  OpenAPIRequestValidator,
  logger
) => {
  const errors = {
    SecurityCheckFailed: class extends Error {},
    RequestValidationError: class extends Error {}
  };

  const build = async ({ api, controllers, securityHandlers }) => {
    const router = controllers.reduce((router, item) => {
      if (!item.path || !item.method) {
        throw new Error('Required properties are not defined for controller');
      }
      if (!item.handler) {
        throw new Error('Required property "handler" is not defined for controller');
      }
      const itemSchema = api.paths[item.path][item.method];
      if (!itemSchema) {
        throw new Error('Couldn\'t find controller definition in the api doc');
      }

      const secHandler = new OpenAPISecurityHandler({
        securityDefinitions: api?.components?.securitySchemes,
        securityHandlers,
        operationSecurity: itemSchema.security || []
      });
      const requestValidator = new OpenAPIRequestValidator({
        parameters: itemSchema.parameters,
        requestBody: itemSchema.requestBody,
      });

      router[item.method](item.path, [
        // security
        async (req, res, next) => {
          // Need to check if it handles the case with multiple
          // security handlers for one operation correctly according
          // the spec
          const result = await secHandler.handle(req)
            // As written in the docs it should resolve true in success
            // case, but actually it just resolves undefined
            .then(() => true)
            .catch((error) => {
              logger.error('Security handler error', error);
              return false;
            });
          if (!result) {
            return next(new errors.SecurityCheckFailed(
              'Failed to pass security'
            ));
          }
          next();
        },
        // request validation
        (req, res, next) => {
          const {
            errors: validationErrors
          } = requestValidator.validateRequest(req) || { errors: [] };
          if (validationErrors.length) {
            const error = new errors.RequestValidationError('Request validation failed');
            error.errors = validationErrors;
            return next(error);
          }
          next();
        },
        item.handler
      ]);
      return router;
    }, express.Router());

    return router;
  };

  return { build, errors };
};
factory[dependencies] = [
  express,
  OpenAPISecurityHandler,
  OpenAPIRequestValidator,
  logger
];
factory[singleton] = true;
export default factory;
