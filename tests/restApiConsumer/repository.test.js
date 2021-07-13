import axios from 'axios';

import {ApiRepository} from "../../src/restApiConsumer/repository";
import {ApiResource} from "../../src/restApiConsumer/resource";

import {AXIOS_CONFIG, HEADERS, HOST, CustomApiResource} from "./testData";


jest.mock('axios');
jest.mock('../../src/restApiConsumer/resource');


describe("Check `ApiRepository` object.", () => {
  const api = new ApiRepository(HOST, HEADERS, AXIOS_CONFIG);

  const spy = jest.spyOn(api, "createResource");

  test("Check `ApiRepository` fields.", () => {
    expect(api.host)
      .toBe(HOST);

    expect(api.headers)
      .toEqual(HEADERS);

  });

  test("Check `axios` calls and usage.", () => {
    expect(axios.create.mock.calls.length)
      .toBe(1);

    expect(axios.create.mock.calls[0][0])
      .toEqual({
        baseURL: HOST,
        headers: HEADERS,
        withCredentials: true,
        timeout: 1000
      });
  });

  api.createResource("customers",);
  api.createResource("products", undefined, CustomApiResource);
  api.createResource("orders", "customer-orders/");

  test("Check `createResource` method.", () => {
    expect(ApiResource.mock.calls[0][1])
      .toEqual("customers");

    expect(ApiResource.mock.calls[1][1])
      .toEqual("products");

    expect(ApiResource.mock.calls[2][1])
      .toEqual("customer-orders/");

    expect(ApiResource.mock.instances.length)
      .toBe(3);

    expect(api.customers)
      .toBeInstanceOf(ApiResource);

    expect(api.products)
      .toBeInstanceOf(CustomApiResource);

    expect(api.orders)
      .toBeInstanceOf(ApiResource);
  });

  api.customers.create({});
  api.products.list();
  api.orders.retrieve(42);

  test("Check `ApiResource` method calls.", () => {
    expect(api.customers.create.mock.calls.length)
      .toBe(1);

    expect(api.products.list.mock.calls.length)
      .toBe(1);

    expect(api.orders.retrieve.mock.calls.length)
      .toBe(1);
  })
});



