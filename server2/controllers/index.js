import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../services/di/index.js';
import helloworld from './helloworld/index.js';
import createItem from './item-create/index.js';

const factory = (
  ...controllers
) => {
  return controllers;
};
factory[dependencies] = [
  helloworld,
  createItem
];
factory[singleton] = true;
export default factory;