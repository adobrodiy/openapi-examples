import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import SwaggerParser from '@apidevtools/swagger-parser';
import config from '../../services/config/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const factory = (path, __dirname, config) => {
  return async ({ controllers }) => {
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
          '$ref': path.resolve(__dirname, './components.yml#/securitySchemes')
        }
      }
    });

    return api;
  };
};
factory[dependencies] = [path, __dirname, config];
factory[singleton] = true;
export default factory;
