/**
 * Create an instance of the service container
 */
const createContainer = <TServiceDescriptor>() => {
  type TServiceNames = keyof TServiceDescriptor;

  type FactoryOrSingleton<T extends TServiceNames> =
    | (() => TServiceDescriptor[T])
    | TServiceDescriptor[T];

  type TServiceFactoriesCollection = {
    [K in keyof TServiceDescriptor]: FactoryOrSingleton<K>;
  };

  const factories = {} as TServiceFactoriesCollection;

  const container = {
    /**
     * Resolve 1..N services registered in the container
     * @param services List of services to resolve
     */
    getService: <TServiceName extends TServiceNames>(
      ...services: TServiceName[]
    ) => {
      const resolve = (service: TServiceName) => {
        const factoryOrInstance = factories[service];
        if (factoryOrInstance === undefined) {
          throw new Error(
            `Service ${service} has not been registered in container`
          );
        }
        try {
          return typeof factoryOrInstance === "function"
            ? factoryOrInstance()
            : factoryOrInstance;
        } catch (ex) {
          throw new Error(`Failed initializing service ${service}: ${ex}`);
        }
      };
      return services.reduce(
        (acc, cur) => ({ ...acc, ...{ [cur]: resolve(cur) } }),
        {}
      ) as Pick<TServiceDescriptor, TServiceName>;
    },
    /**
     * Register a service factory or singleton in the container
     * @param name Name of service to register
     * @param factory Factory function that instantiates the service
     */
    register: <TServiceName extends TServiceNames>(
      name: TServiceName,
      factory: FactoryOrSingleton<TServiceName>
    ) => {
      if (factories[name] !== undefined) {
        throw new Error(`Service ${name} already registered in container`);
      }

      factories[name] = factory;
      return container;
    }
  };

  return container;
};

export default createContainer;
