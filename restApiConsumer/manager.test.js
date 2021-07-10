import {configureApi, getApi} from "./index";
import {ApiManagerSingleton} from "./manager";


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


describe("Chech `ApiManagerSingleton`.", () => {
  const apiManager = ApiManagerSingleton.getInstance();
  apiManager.configure(HOST, API_CONFIG, HEADERS, AXIOS_CONFIG);

  test(
    "Check ApiManagerSingleton properties.", () => {
      expect(apiManager)
        .toHaveProperty("host", HOST);

      expect(apiManager)
        .toHaveProperty("config", ApiManagerSingleton.parseConfig(API_CONFIG));

      expect(apiManager)
        .toHaveProperty("commonHeaders", HEADERS);

      expect(apiManager)
        .toHaveProperty("axiosConfig", AXIOS_CONFIG);
    }
  )
});




