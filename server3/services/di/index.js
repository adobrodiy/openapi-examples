export const dependenciesKey = Symbol('dependencies');
export const singletonKey = Symbol('singleton');

export const initContainer = async () => {
  const singletons = new Map();

  const register = async (factory) => {
    if (!factory[dependenciesKey]) {
      return factory;
    }
    // I tried to use Promise.all (to build deps in parrallel)
    // instead of .reduce, but it leads to singletons to be 
    // initialized several times (unpredictable amount) finally
    // being not singletons
    const depItems = await factory[dependenciesKey]
      .reduce(async (prev, depFactory) => {
        const registeredDeps = await prev;
        let item;
        if (depFactory[singletonKey]) {
          item = singletons.get(depFactory);
          if (!item) {
            item = await register(depFactory);
            singletons.set(depFactory, item);
          }
        } else {
          item = await register(depFactory);
        }
        return [...registeredDeps, item];
      }, Promise.resolve([]));
    return factory(...depItems);
  };

  return { register };
};
