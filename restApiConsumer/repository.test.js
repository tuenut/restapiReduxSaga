import axios from 'axios';

import {ApiRepository} from "./repository";
import {ApiResource} from "./resource";


jest.mock('axios');
jest.mock('./resource');

const axios_client = jest.fn();
axios.create.mockReturnValue(axios_client);


describe("Check `ApiRepository` object.", () => {
  const HOST = "https://example.com";
  const API_CONFIG = [
    "customers",
    "products",
    {
      name: "orders",
      path: "customer-orders/"
    },
  ];
  const HEADERS = {'X-Custom-Header': 'foobar'};
  const AXIOS_CONFIG = {withCredentials: true, timeout: 1000,};

  class CustomApiResource extends ApiResource {
  }

  const api = new ApiRepository(HOST, HEADERS, AXIOS_CONFIG);

  test(
    "Check `ApiRepository` fields.", () => {
      expect(api.host)
        .toBe(HOST);

      expect(api.headers)
        .toEqual(HEADERS);

      expect(api.client)
        .toEqual(axios_client);
    });

  test("Check `axios` calls and usage.", () => {
    expect(axios.create.mock.calls.length).toBe(1);
  });

  test("Check `createResource` method.", () => {
    api.createResource("customers", "customers/");
    api.createResource("orders", "orders/", CustomApiResource);

    api.customers.list();
    api.orders.retrieve(42);

    expect(ApiResource.mock.instances.length)
      .toBe(2);


    expect(api.customers)
      .toBeInstanceOf(ApiResource);

    expect(api.orders)
      .toBeInstanceOf(ApiResource);

    expect(api.orders)
      .toBeInstanceOf(CustomApiResource);


    expect(api.customers.list.mock.calls.length)
      .toBe(1);

    expect(api.orders.retrieve.mock.calls.length)
      .toBe(1);

  });
});



