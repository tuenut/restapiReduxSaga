import {configureApi, getApi, ApiManagerSingleton} from "./index";
import {ApiRepository} from "./repository";


const HOST = "https://example.com";
const API_CONFIG = [
  {
    name: "customers",
    path: "customers/",
  },
  {
    name: "orders",
    path: "orders/",
  },
  {
    name: "products",
    path: "products/",
  },
];
const HEADERS = {'X-Custom-Header': 'foobar'};
const AXIOS_CONFIG = {withCredentials: true, timeout: 1000,};


test(
  "Check ApiManagerSingleton properties." +
  " Should be: ['host', 'config', 'commonHeaders', 'axiosConfig']", () => {
    configureApi(HOST, API_CONFIG, HEADERS, AXIOS_CONFIG);

    const apiManager = ApiManagerSingleton.getInstance();

    expect(apiManager)
      .toHaveProperty("host", HOST);

    expect(apiManager)
      .toHaveProperty("config", API_CONFIG);

    expect(apiManager)
      .toHaveProperty("commonHeaders", HEADERS);

    expect(apiManager)
      .toHaveProperty("axiosConfig", AXIOS_CONFIG);
  }
)


test(
  "Check `ApiRepository` object.", () => {
    // configureApi();

    const apiManager = ApiManagerSingleton.getInstance();

    const api = getApi();

    expect(apiManager.api).toBeInstanceOf(ApiRepository);
    expect(api).toBeInstanceOf(ApiRepository);
  }
)