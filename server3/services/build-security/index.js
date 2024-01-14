import {
  singletonKey as singleton,
  dependenciesKey as dependencies
} from '../../services/di/index.js';

const factory = () => {
  const errors = {
    Unauthorized: class extends Error {}
  };
  
  const build = ({
    security, securityHandlers, operationId: opId
  }) => {
    const handlersToExecute = [];
    security.forEach((item) => {
      const keys = Object.keys(item);
      if (!keys.length) {
        throw new Error(
          `OperationId ${opId}: security item def has no keys`
        );
      }
      if (keys.length > 1) {
        throw new Error(
          `OperationId ${opId}: security item def many keys. `
          +`Not implemented`
        );
      }
      const key = keys[0];
      const scopes = item[key];
      if (!Array.isArray(scopes)) {
        throw new Error(
          `OperationId ${opId}: security item ${key}: `
          + `scopes should be an array`
        );
      }
      if (scopes.length !== 0) {
        throw new Error(
          `OperationId ${opId}: security item ${key}: `
          +`scopes are not empty. Not implemented`
        );
      }
      const handler = securityHandlers[key];
      if (!handler) {
        throw new Error(
          `OperationId ${opId}: security item ${key}: `
          + `handler is not configured`
        );
      }
      handlersToExecute.push(handler);
    });

    return async (req, res, next) => {
      if (!security.length) {
        return next();
      }
      const result = await handlersToExecute.reduce(
        async (prev, handler) => {
          return (await prev) || (await handler(req));
        },
        false
      );
      if (result) {
        req.auth = result;
        return next();
      }
      return next(new errors.Unauthorized('Unauthorized'));
    };
  };

  return { errors, build };
};
factory[dependencies] = [];
factory[singleton] = true;
export default factory;
