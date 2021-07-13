import {configureApi, getApi} from "../../src/restApiConsumer/index";
import {ApiManagerSingleton} from "../../src/restApiConsumer/manager";

import {API_CONFIG, AXIOS_CONFIG, HEADERS, HOST} from "./testData";



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




