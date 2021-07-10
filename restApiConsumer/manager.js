import {EndpointDoesNotExist, ShouldBeConfigured} from "./errors";
import {ApiRepository} from "./repository";

/**
 * @class ApiManagerSingleton
 * @classdesc
 *
 * @property {ApiRepository} #_api -
 * @property {string} host -
 * @property {object | Function} commonHeaders -
 * @property {ApiEndpointsRepo} endpointsConfig -
 * @property {ApiManagerSingleton} #instance -
 *
 * @todo: надо как следует проработать это все. Вероятно, можно сделать проще.
 * @todo: заюавно, что все равно вначале оно все равно обращается ко всем полям и все равно все создает.
 *
 * */
export class ApiManagerSingleton {
  #_api;

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
    return this.#_api;
  }

  set api(apiRepository) {
    /**
     * @param {ApiRepository} target -
     * @param {string} name -
     *
     * @returns {ApiResource} Some object extends BaseApiResource.
     * */
    const proxyGetter = (target, name) => {
      console.log("Call proxy getter");

      const apiManager = ApiManagerSingleton.getInstance();

      if (!(name in target)) {
        console.log(`<${name}> not in <${target}>`)
        if (name in apiManager.config) {
          console.log(`<${name}> in <${apiManager.config}>`)
          target.createResource(name, apiManager.config[name]._class);
        } else {
          throw new EndpointDoesNotExist(
            name,
            {target, config: apiManager.config}
          );
        }
      }

      return target[name];
    }

    this.#_api = new Proxy(apiRepository, {get: proxyGetter});
  }

  /**
   *
   * @param {string} [host] - Your RESTApi base url or host. Can be empty string.
   * @param {Array} [config] - Api resources config.
   * @param {object | Function} commonHeaders - You can set some headers wich
   *  will used in any request or provide a callback, wich hould generate some
   *  headers for any request.
   * @param {AxiosRequestConfig} [axiosConfig] - You can configure axios directly.
   *
   * @example
   *  ApiManagerSingleton.configure(
   *    "https://example.com/",
   *    [{name: "customers"}, {name: "orders"}, {name: "products"}, ]
   *  )
   *
   *  ApiManagerSingleton.configure(
   *    "https://example.com/",
   *    [{name: "customers"}, {name: "orders"}, {name: "products"}, ],
   *    {'X-Custom-Header': 'foobar'}
   *  )
   *
   *  ApiManagerSingleton.configure(
   *    "https://example.com/",
   *    [
   *      {name: "customers", _class: CustomResourceKlassForUsers},
   *      {name: "orders", path: "customer-orders/"},
   *      {name: "products"},
   *    ],
   *    () => ({
   *      'X-Custom-Header': localStorage.getItem('foo')
   *    }),
   *    {withCredentials: true, timeout: 1000,}
   *  )
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