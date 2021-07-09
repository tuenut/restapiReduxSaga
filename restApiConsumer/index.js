import {ApiRepository} from "./repository.js";
import {ApiResource} from "./resource.js";
import {EndpointDoesNotExist, ShouldBeConfigured} from "./errors.js";


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
      const apiManager = ApiManagerSingleton.getInstance();

      if (!(name in target)) {
        if (name in apiManager.config) {
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
   * @param {ApiEndpointsRepo} [config] - Api resources config.
   * @param {object | Function} commonHeaders - You can set some headers wich
   *  will used in any request or provide a callback, wich hould generate some
   *  headers for any request.
   * @param {AxiosRequestConfig} [axiosConfig] - You can configure axios directly.
   *
   * @example
   *  ApiManagerSingleton.configure(
   *    "https://example.com/",
   *    {products, orders, customers}
   *  )
   *
   *  ApiManagerSingleton.configure(
   *    "https://example.com/",
   *    {products, orders, customers},
   *    () => ({
   *      'X-Custom-Header': localStorage.getItem('foo')
   *    })
   *  )
   *
   *  ApiManagerSingleton.configure(
   *    "https://example.com/",
   *    {
   *      products,
   *      orders: "customer-orders/",
   *      customers: {path: "customers/", _class: CustomResourceKlassForUsers}
   *    },
   *    {'X-Custom-Header': 'foobar'},
   *    {withCredentials: true, timeout: 1000,}
   *  )
   * */
  configure(host, config, commonHeaders, axiosConfig) {
    this.host = (host !== undefined)
      ? host
      : this.host;

    this.config = (config !== undefined)
      ? [...config]
      : this.config;

    this.commonHeaders = (commonHeaders !== undefined)
      ? commonHeaders
      : this.commonHeaders;

    this.axiosConfig = (axiosConfig !== undefined)
      ? {...axiosConfig}
      : this.axiosConfig;

    this.api = new ApiRepository(this.host, this.commonHeaders, this.axiosConfig);
  }
}

/** Uses to configure api.
 *
 * @method configureApi
 *
 * @param {string} [host] - baseUrl для axios конфига
 * @param {ApiEndpointsRepo} [config] - словарь с эндпоинтами
 * @param {object | Function} commonHeaders - заголовки, которые *в теории* буду использоваться при каждом запросе.
 *  Если в качестве заголовков передать функцию, то она будет вызвана каждый раз при обращении к полю заголовков
 *  и результат будет использован в качестве заголовков.
 * @param {AxiosRequestConfig} [axiosConfig] - конфигурация axios
 * */
export const configureApi = (host, config, headers, axiosConfig) =>
  ApiManagerSingleton.getInstance().configure(host, config, headers, axiosConfig);

/** Uses to get configered api object for usage in any point of your app.
 *
 * Raises `ShouldBeConfigured` if called before call `configureApi`,
 * means api does not configured yet.
 *
 * @method getApi
 * */
export const getApi = () => ApiManagerSingleton.getApi();

