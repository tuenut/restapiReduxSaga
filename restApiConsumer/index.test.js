import axios from "axios/index";

import {configureApi, getApi} from "./index";


const axios_client = jest.fn();
axios.create.mockReturnValue(axios_client);


const HOST = "https://example.com";
const API_CONFIG = [
  "customers",
  {
    name: "products",
    path: "custom-products",
  },
  {
    name: "orders",
    _class: class CustomApiResource extends ApiResource {
      close(id) {
        return this.request("retrieve", this.retrieve(id, "close"));
      }
    }
  },
];
const HEADERS = {'X-Custom-Header': 'foobar'};
const AXIOS_CONFIG = {withCredentials: true, timeout: 1000,};




describe("Check api usage", () => {
  configureApi(HOST, API_CONFIG, HEADERS, AXIOS_CONFIG);

  const api = getApi();
});