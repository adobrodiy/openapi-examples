import { 
  dependenciesKey as dependencies, 
  initContainer
} from './services/di/index.js';
import logger from './services/logger/index.js';
import config from './services/config/index.js';
import controllers from './controllers/index.js';
import express from 'express';
import errorMiddleware from './services/error-middleware/index.js';
import * as OpenApiValidator from 'express-openapi-validator';
import buildApi from './services/build-api/index.js';
import { connector as routesConnector } from 'swagger-routes-express';
import swaggerUi from 'swagger-ui-express';
import securityHandlers from './services/security-handlers/index.js';

const main = async (
  express,
  logger,
  config,
  controllers,
  swaggerUi,
  errorMiddleware,
  OpenApiValidator,
  securityHandlers,
  buildApi,
  routesConnector
) => {
  logger.info('Starting the server...');

  const { api, handlerMap, securityMap } = await buildApi({
    controllers, securityHandlers
  });
  const connectSecurity = routesConnector(securityMap, api);
  const connectRoutes = routesConnector(handlerMap, api);

  const app = express();
  app.use(express.json()); //for parsing application/json requestBody

  app.get(`${config.apiBasePath}/openapi.json`, (req, res) => res.json(api));
  app.use('/openapi-ui', swaggerUi.serve, swaggerUi.setup(api));
  connectSecurity(app);
  app.use(
    OpenApiValidator.middleware({
      apiSpec: api,
      validateRequests: {
        allowUnknownQueryParameters: true,
        // coerceTypes: true
      },
      validateApiSpec: false,
      // it does not work correctly with multiple sec definitions
      // so we use custom stuff
      validateSecurity: false,
      // operationHandlers.resolver could be used to config routing
      operationHandlers: false,
      validateResponses: true
    }),
  );
  connectRoutes(app);
  app.use(errorMiddleware());

  app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
    logger.info(`Check http://localhost:${config.port}${config.apiBasePath}/openapi.json for api doc`);
    logger.info(`Check http://localhost:${config.port}/openapi-ui for api doc ui`);
  });
};
main[dependencies] = [
  express,
  logger,
  config,
  controllers,
  swaggerUi,
  errorMiddleware,
  OpenApiValidator,
  securityHandlers,
  buildApi,
  routesConnector
];
(async () => {
  const ioc = await initContainer();
  await ioc.register(main);
})().catch((e) => {
  console.error(e);
});
