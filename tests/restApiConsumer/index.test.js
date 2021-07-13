import axios from "axios";

import {configureApi, getApi} from "../../src/restApiConsumer/index";
import {ApiResource} from "../../src/restApiConsumer/resource";

import {
  API_CONFIG,
  AXIOS_CONFIG,
  CUSTOMERS,
  HEADERS,
  HOST,
  NEW_CUSTOMER,
  ORDERS,
  PRODUCTS
} from "./testData";


jest.mock('axios');

beforeAll(() => axios.__loadTestData({
  customers: CUSTOMERS,
  products: PRODUCTS,
  "customer-orders": ORDERS
}))


test("Check api usage", () => {
  configureApi(HOST, API_CONFIG, HEADERS, AXIOS_CONFIG);

  const api = getApi();

  expect(api.customers.retrieve(1)).resolves
    .toHaveProperty("status", 200);

  expect(api.products.retrieve(6).then(response => response.data)).resolves
    .toHaveProperty("id", 6);

  expect(api.orders.retrieve(3).then(response => response.data)).resolves
    .toHaveProperty("id", 3);

  expect(api.customers.create(NEW_CUSTOMER)).resolves
    .toHaveProperty("status", 201);
});