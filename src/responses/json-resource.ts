import JsonResourceCollection from "#src/responses/json-resource-collection.js";

export type JsonResourceClass<T, R> = {
  new (resource: T): JsonResource<T, R>;
  make(resource: T): JsonResource<T, R>;
};

abstract class JsonResource<T, R> {
  protected resource: T;

  constructor(resource: T) {
    this.resource = resource;
  }

  abstract toArray(): R;

  toJSON(): R {
    return this.toArray();
  }

  static make<T, R>(
    this: new (resource: T) => JsonResource<T, R>,
    resource: T,
  ) {
    return new this(resource);
  }

  static collection<T, R>(
    this: JsonResourceClass<T, R>,
    resources: T[],
    meta?: Record<string, unknown>,
  ) {
    return new JsonResourceCollection(resources, this, meta);
  }
}

export default JsonResource;
