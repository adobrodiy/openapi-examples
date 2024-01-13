import {
  singletonKey as singleton,
  dependenciesKey as dependencies
} from '../../services/di/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const factory = (path, __dirname) => {
  return {
    path: '/helloworld',
    method: 'get',
    apiRef: path.resolve(__dirname, './api.yml'),
    handler: (req, res) => {
      res.json({ message: 'Hello World!' });
    }
  };
};
factory[dependencies] = [path, __dirname];
factory[singleton] = true;
export default factory;
