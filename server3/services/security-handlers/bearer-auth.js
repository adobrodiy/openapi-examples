import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import config from '../../services/config/index.js';
import logger from '../../services/logger/index.js';

const factory = (config, logger) => {
  return (req) => {
    const header = req.header('Authorization') || ''; 
    const token = header.replace('Bearer ', '');
    if (token === 'qwerty123') {
      return { uid: 'user_id' };
    };
    return false;
  };
};
factory[dependencies] = [config, logger];
factory[singleton] = true;
export default factory;
