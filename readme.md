# Hypospray

A simple library for creating a service container, and then requesting services from it.

Using the library is as simple as creating a container via:

```typescript
interface AppServices {
    foo: FooService;
    bar: BarService;
}

export const container = createContainer<AppServices>()
    .register("foo", () => new FooService()) // Register a factory
    .register("bar", new BarService()); // Register a singleton
```

And then, wherever you require the service, import the container instance and call:

```typescript
const { foo } = container.getService("foo");
```

Attempting to register the same service twice will lead to errors, as will trying to resolve a service that hasn't been registered
