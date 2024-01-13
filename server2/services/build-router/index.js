import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import express from 'express';
import logger from '../../services/logger/index.js';

const factory = (
  express,
  logger
) => {
  const build = async ({ controllers }) => {
    const router = controllers.reduce((router, item) => {
      if (!item.path || !item.method) {
        throw new Error('Required properties are not defined for controller');
      }
      if (!item.handler) {
        throw new Error('Required property "handler" is not defined for controller');
      }
      router[item.method](item.path, item.handler);
      return router;
    }, express.Router());

    return router;
  };

  return { build };
};
factory[dependencies] = [
  express,
  logger
];
factory[singleton] = true;
export default factory;
