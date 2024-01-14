import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import SwaggerParser from '@apidevtools/swagger-parser';
import config from '../../services/config/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import buildSecurity from '../../services/build-security/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const factory = (path, __dirname, config, SwaggerParser, buildSecurity) => {

  const wrapHandler = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res);
      } catch (error) {
        next(error);
      }
    }
  };

  return async ({ controllers, securityHandlers }) => {
    const paths = controllers.reduce((paths, item) => {
      if (!item.path || !item.method || !item.apiRef) {
        throw new Error(`Required properties are not defined for controller`);
      }
      if (paths[item.path] && paths[item.path][item.method]) {
        throw new Error(`Duplicate definition for ${item.path}#${item.method} controller.`);
      }
      if (!paths[item.path]) {
        paths[item.path] = {};
      }
      paths[item.path][item.method] = {
        '$ref': item.apiRef
      }
      return paths;
    }, {});

    const api = await SwaggerParser.validate({
      openapi: '3.1.0',
      info: {
        title: 'API',
        version: '0.1.0'
      },
      servers: [{ url: config.apiBasePath }],
      paths,
      components: {
        securitySchemes: {
          '$ref': path.resolve(__dirname, './security-schemes.yml')
        }
      }
    });

    const { handlerMap, securityMap } = controllers.reduce(
      ({ handlerMap, securityMap }, item) => {
        if (!item.handler) {
          throw new Error(`Required properties are not defined for controller`);
        }
        const itemSchema = paths[item.path][item.method];
        const operationId = itemSchema.operationId;      
        if (handlerMap[operationId]) {
          throw new Error(`Duplicate operationId ${operationId}`);
        }
        handlerMap[operationId] = wrapHandler(item.handler);
        const security = itemSchema.security || [];
        securityMap[operationId] = buildSecurity.build({
          security, securityHandlers, operationId
        });
        return {handlerMap, securityMap};
      },
      { handlerMap: {}, securityMap: {} }
    );

    return { api, handlerMap, securityMap };
  };
};
factory[dependencies] = [path, __dirname, config, SwaggerParser, buildSecurity];
factory[singleton] = true;
export default factory;
