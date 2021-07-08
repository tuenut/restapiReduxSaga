import {configureApi, ApiManagerSingleton} from "./index";


test(
  "Check ApiManagerSingleton properties." +
  " Should be: ['host', 'config', 'commonHEaders', 'axiosConfig']", () => {
    configureApi();

    const apiManager = new ApiManagerSingleton();

    expect(apiManager).toHaveProperty("host");
    expect(apiManager).toHaveProperty("config");
    expect(apiManager).toHaveProperty("commonHeaders");
    expect(apiManager).toHaveProperty("axiosConfig");
  }
)