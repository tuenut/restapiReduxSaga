import {ApiResource} from "../../src/restApiConsumer/resource";

export const HOST = "https://example.com";
export const API_CONFIG = [
  "customers",
  "products",
  {
    name: "orders",
    path: "customer-orders/"
  },
];
export const HEADERS = {'X-Custom-Header': 'foobar'};
export const AXIOS_CONFIG = {withCredentials: true, timeout: 1000,};

export class CustomApiResource extends ApiResource {
}

export const ENTITY_ID = 42;
export const RESOURCE_PATH = "customers";
export const OPTIONS = {name: "Bob"};
export const EXTRA_ACTION = "extra";
export const CREATE_DATA = {name: "Tina"};
export const UPDATE_DATA = {name: "Bob"};


export const CUSTOMERS = [
  {
    id: 1,
    name: "Ivan",
    age: 27,
    address: {
      city: "N",
      street: "Krivaya",
      building: "42",
      apartment: "21"
    }
  },
  {
    id: 2,
    name: "Asya",
    age: 20,
    address: {
      city: "N",
      street: "Pryamaya",
      building: "21",
      apartment: "42"
    }
  },
  {
    id: 3,
    name: "Osip",
    age: 33,
    address: {
      city: "N",
      street: "Leavaya",
      building: "10",
      apartment: "11"
    }
  },
  {
    id: 4,
    name: "Sherlock Holmes",
    age: 42,
    address: {
      city: "London",
      street: "Baker Street",
      building: "221B",
      apartment: null
    }
  },
];

export const PRODUCTS = [
  {id: 1, name: "Teapot", price: 10},
  {id: 2, name: "Cell Phone", price: 199},
  {id: 3, name: "Notebook", price: 599},
  {id: 4, name: "Flowers", price: 3},
  {id: 5, name: "Chair", price: 55},
  {id: 6, name: "Violin", price: 299},
];

export const ORDERS = [
  {
    id: 1,
    user: 4,
    goods: [{id: 6, count: 1}, {id: 5, count: 1}],
    status: "processing"
  },
  {
    id: 2,
    user: 3,
    goods: [{id: 4, count: 10}],
    status: "processing"
  },
  {
    id: 3,
    user: 1,
    goods: [{id: 2, count: 1}, {id: 3, count: 1}],
    status: "processing"
  },
]

export const NEW_CUSTOMER = {
    name: "Alice",
    age: 14,
    address: {
      city: "London",
      street: "SILVER STREET",
      building: "LIDDELL HOUSE",
      apartment: null
    }
  }