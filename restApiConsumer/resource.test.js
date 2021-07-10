import {ApiResource} from "./resource";
import {UrlConstructor} from "./urlConstructor";


jest.mock('./urlConstructor');


describe("Check `ApiResource`", () => {
  const request = jest.fn();

  const RESOURCE_PATH = "customers";
  const OPTIONS = {name: "Bob"};
  const EXTRA_ACTION = "extra";
  const CREATE_DATA = {name: "Tina"};
  const UPDATE_DATA = {name: "Bob"};

  const apiResource = new ApiResource(request, RESOURCE_PATH);

  test("Check `retrieve` method.", () => {
    apiResource.retrieve(42, EXTRA_ACTION, OPTIONS);

    expect(request.mock.calls[0][0])
      .toEqual("retrieve");

    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls[0][0])
      .toEqual(42);

    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls[0][1])
      .toEqual(EXTRA_ACTION);

    expect(UrlConstructor.mock.instances[0].retrieve.mock.calls[0][2])
      .toEqual(OPTIONS);
  });

  test("Check `list` method.", () => {
    apiResource.list(OPTIONS, EXTRA_ACTION);

    expect(request.mock.calls[1][0])
      .toEqual("list");

    expect(UrlConstructor.mock.instances[0].list.mock.calls[0][0])
      .toEqual(OPTIONS);

    expect(UrlConstructor.mock.instances[0].list.mock.calls[0][1])
      .toEqual(EXTRA_ACTION);
  });

  test("Check `create` method.", () => {
    apiResource.create(CREATE_DATA);

    expect(request.mock.calls[2][0])
      .toEqual("create");

    expect(request.mock.calls[2][2])
      .toEqual(CREATE_DATA);
  });

  test("Check `update` method.", () => {
    apiResource.update(42, UPDATE_DATA);

    expect(request.mock.calls[3][0])
      .toEqual("update");

    expect(request.mock.calls[3][2])
      .toEqual(UPDATE_DATA);

    expect(UrlConstructor.mock.instances[0].update.mock.calls[0][0])
      .toEqual(42);
  });

  test("Check `delete` method.", () => {
    apiResource.delete(42);

    expect(request.mock.calls[4][0])
      .toEqual("delete");

    expect(UrlConstructor.mock.instances[0].delete.mock.calls[0][0])
      .toEqual(42);
  });

  test("Controlls count of calls", () => {
    expect(request.mock.calls.length)
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
