import { type JsonResourceClass } from "#src/responses/json-resource.js";

class JsonResourceCollection<T, R> {
  constructor(
    private readonly resources: T[],
    private readonly resourceClass: JsonResourceClass<T, R>,
    private readonly meta?: Record<string, unknown>,
  ) {}

  static make<T, R>(
    resources: T[],
    resourceClass: JsonResourceClass<T, R>,
    meta?: Record<string, unknown>,
  ) {
    return new JsonResourceCollection(resources, resourceClass, meta);
  }

  toArray(): R[] {
    return this.resources.map((resource) =>
      this.resourceClass.make(resource).toArray(),
    );
  }

  toJSON() {
    return {
      data: this.toArray(),
      ...(this.meta && { meta: this.meta }),
    };
  }
}

export default JsonResourceCollection;
