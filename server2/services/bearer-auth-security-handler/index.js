import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';

const factory = () => {
  return (req, scopes, securityDefinition) => {
    const header = req.header('Authorization') || ''; 
    const token = header.replace('Bearer ', '');
    return token === 'qwerty123';
  };
};
factory[dependencies] = [];
factory[singleton] = true;
export default factory;
