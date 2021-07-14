import {EndpointDoesNotExist, ShouldBeConfigured} from "./errors";
import {ApiRepository} from "./repository";


/**
 * @classdesc That class just contains configurations and api repository.
 * It should not be used directly or instantialed through `new`.
 * Instead use `getApi()` to get api repository object and
 * `ApiManagerSingleton.getInstance()` if you realy need instance of that class.
 *
 * @property {ApiRepository} #api - contains api repository object.
 * @property {string} host - contains host name.
 * @property {object | Function} commonHeaders - contains headers.
 * @property {ApiEndpointsRepo} endpointsConfig - contains contains config
 * @property {ApiManagerSingleton} instance - Readonly property contains
 *  singleton inctsnce.
 *
 * */
export class ApiManagerSingleton {
  #api;

  /** Should not be used directly. */
  constructor() {
    if (ApiManagerSingleton.hasOwnProperty('instance')) {
      return ApiManagerSingleton.instance;
    } else {
      this.host = "";
      this.config = {};
      this.commonHeaders = {};
      this.axiosConfig = {};

      Object.defineProperty(ApiManagerSingleton, 'instance', {
        value: this,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  }

  /** Method returns ApiManagerSingleton instance. Shoud be called instead
   * of constructor.
   *
   * @returns {ApiManagerSingleton}
   * */
  static getInstance() {
    if (ApiManagerSingleton.hasOwnProperty('instance')) {
      return ApiManagerSingleton.instance;
    } else {
      return new ApiManagerSingleton();
    }
  }

  /** Uses to get get api repository object.
   *
   * @returns {ApiRepository}
   * */
  static getApi() {
    const apiManager = ApiManagerSingleton.getInstance();

    if (apiManager)
      return apiManager.api;
    else {
      throw new ShouldBeConfigured();
    }
  }

  get api() {
    return this.#api;
  }

  /** Create new api repository and wrap it in Proxy with custom getter. */
  set api(apiRepository) {
    /** Getter autocreates on the fly properties with api resources due to api
     *   config.
     * If resource already exists, just returns it.
     *
     * Sort of metaprogramming thing.
     *
     * @param {ApiRepository} target - Api repository object.
     * @param {string} name - Property name.
     *
     * @returns {ApiResource} Some object extends BaseApiResource.
     * */
    const proxyGetter = (target, name) => {
      const apiManager = ApiManagerSingleton.getInstance();

      if (!(name in target)) {
        if (name in apiManager.config) {
          target.createResource(
            name,
            apiManager.config[name].path,
            apiManager.config[name]._class
          );

        } else {
          throw new EndpointDoesNotExist(
            name,
            {target, config: apiManager.config}
          );
        }
      }

      return target[name];
    }

    this.#api = new Proxy(apiRepository, {get: proxyGetter});
  }

  /** Configure instance.
   *
   * @param {string} [host] - Your RESTApi base url or host. Can be empty string.
   * @param {Array<string|ApiConfig>} [config] - Api resources config.
   * @param {object | Function} commonHeaders - You can set some headers wich
   *  will used in any request or provide a callback, wich hould generate some
   *  headers for any request.
   * @param {AxiosRequestConfig} [axiosConfig] - You can configure axios directly.
   * */
  configure(host, config, commonHeaders, axiosConfig) {
    this.host = (host !== undefined)
      ? host
      : this.host;

    this.config = (config !== undefined)
      ? ApiManagerSingleton.parseConfig(config)
      : this.config;

    this.commonHeaders = (commonHeaders !== undefined)
      ? commonHeaders
      : this.commonHeaders;

    this.axiosConfig = (axiosConfig !== undefined)
      ? {...axiosConfig}
      : this.axiosConfig;

    this.api = new ApiRepository(this.host, this.commonHeaders, this.axiosConfig);
  }

  static parseConfig(config) {
    return Object.assign({}, ...config.map((configItem) => {
      if (typeof configItem === "string") {
        return {[configItem]: {path: configItem}};
      } else {
        return {
          [configItem.name]: {
            path: configItem.path ? configItem.path : configItem.name,
            _class: configItem._class
          }
        }
      }
    }));
  }
}