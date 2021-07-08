export class EndpointDoesNotExist {
  name = "Endpoint {} does not exist!";
  object = null;

  constructor(endpointName, object) {
    this.name = this.name.replace('{}', endpointName);
    this.object = object;
  }
}

export class ShouldBeConfigured {
  name = "Manager should be configured! Use `configureApi` before."

  constructor() {
  }
}