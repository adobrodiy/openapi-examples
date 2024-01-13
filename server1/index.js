import { 
  dependenciesKey as dependencies, 
  initContainer
} from './services/di/index.js';
import logger from './services/logger/index.js';
import config from './services/config/index.js';
import controllers from './controllers/index.js';
import buildApi from './services/build-api/index.js';
import openapiUiMiddleware from './services/openapi-ui/index.js';
import bearerAuth from './services/bearer-auth-security-handler/index.js';
import buildRouter from './services/build-router/index.js';
import express from 'express';
import errorMiddleware from './services/error-middleware/index.js';

const main = async (
  express,
  logger,
  config,
  controllers,
  buildApi,
  openapiUiMiddleware,
  bearerAuth,
  buildRouter,
  errorMiddleware
) => {
  logger.info('Starting the server...');

  const api = await buildApi({ controllers });
  const controllersRouter = await buildRouter.build({
    api, controllers,
    securityHandlers: { bearerAuth }
  });

  const app = express();
  app.use(express.json()); //for parsing application/json requestBody

  app.get(`${config.apiBasePath}/openapi.json`, (req, res) => res.json(api));
  app.use('/openapi-ui', openapiUiMiddleware({
    docUrl: `http://localhost:${config.port}${config.apiBasePath}/openapi.json`
  }));
  app.use(config.apiBasePath, controllersRouter);
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
  buildApi,
  openapiUiMiddleware,
  bearerAuth,
  buildRouter,
  errorMiddleware
];
(async () => {
  const ioc = await initContainer();
  await ioc.register(main);
})().catch((e) => {
  console.error(e);
});
