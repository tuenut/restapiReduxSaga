import {ApiResource} from "../../src/restApiConsumer/resource";
import {UrlConstructor} from "../../src/restApiConsumer/urlConstructor";
import {
  CREATE_DATA, 
  EXTRA_ACTION,
  OPTIONS,
  RESOURCE_PATH,
  UPDATE_DATA,
  ENTITY_ID
} from "./testData";


jest.mock('../../src/restApiConsumer/urlConstructor');
const requestMethod = jest.fn();


describe("Check `ApiResource`", () => {
  const apiResource = new ApiResource(requestMethod, RESOURCE_PATH);

  test("Check `retrieve` method.", () => {
    apiResource.retrieve(ENTITY_ID, EXTRA_ACTION, OPTIONS);

    expect(requestMethod.mock.calls[0][0])
      .toEqual("retrieve");

    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls[0][0])
      .toEqual(ENTITY_ID);

    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls[0][1])
      .toEqual(EXTRA_ACTION);

    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls[0][2])
      .toEqual(OPTIONS);
  });

  test("Check `list` method.", () => {
    apiResource.list(OPTIONS, EXTRA_ACTION);

    expect(requestMethod.mock.calls[1][0])
      .toEqual("list");

    expect(UrlConstructor.mock.instances[0].list.mock.calls[0][0])
      .toEqual(OPTIONS);

    expect(UrlConstructor.mock.instances[0].list.mock.calls[0][1])
      .toEqual(EXTRA_ACTION);
  });

  test("Check `create` method.", () => {
    apiResource.create(CREATE_DATA);

    expect(requestMethod.mock.calls[2][0])
      .toEqual("create");

    expect(requestMethod.mock.calls[2][2])
      .toEqual(CREATE_DATA);
  });

  test("Check `update` method.", () => {
    apiResource.update(ENTITY_ID, UPDATE_DATA);

    expect(requestMethod.mock.calls[3][0])
      .toEqual("update");

    expect(requestMethod.mock.calls[3][2])
      .toEqual(UPDATE_DATA);

    expect(UrlConstructor.mock.instances[0].update.mock.calls[0][0])
      .toEqual(ENTITY_ID);
  });

  test("Check `delete` method.", () => {
    apiResource.delete(ENTITY_ID);

    expect(requestMethod.mock.calls[4][0])
      .toEqual("delete");

    expect(UrlConstructor.mock.instances[0].delete.mock.calls[0][0])
      .toEqual(ENTITY_ID);
  });

  test("Controlls count of calls", () => {
    expect(requestMethod.mock.calls.length)
      .toBe(5);

    expect(UrlConstructor.mock.calls.length)
      .toBe(1);


    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls.length)
      .toBe(1);

    expect(UrlConstructor.mock.instances[0].list.mock.calls.length)
      .toBe(1);

    expect(UrlConstructor.mock.instances[0].create.mock.calls.length)
      .toBe(1);

    expect(UrlConstructor.mock.instances[0].update.mock.calls.length)
      .toBe(1);

    expect(UrlConstructor.mock.instances[0].delete.mock.calls.length)
      .toBe(1);
  });
});
