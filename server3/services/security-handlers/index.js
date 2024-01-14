import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import bearerAuth from './bearer-auth.js';
import serviceAuth from './service-auth.js';

const factory = (bearerAuth, serviceAuth) => {
  return { bearerAuth, serviceAuth };
};
factory[dependencies] = [bearerAuth, serviceAuth];
factory[singleton] = true;
export default factory;