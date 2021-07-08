import {ApiRepository} from "./repository";
import {BaseApiResource} from "./resource";
import {EndpointDoesNotExist, ShouldBeConfigured} from "./errors";


/**
 * @class ApiManagerSingleton
 * @classdesc
 *
 * @property {ApiRepository} api -
 * @property {string} host -
 * @property {object | Function} commonHeaders -
 * @property {ApiEndpointsRepo} endpointsConfig -
 * @property {ApiManagerSingleton} _instance -
 *
 * @todo: надо как следует проработать это все. Вероятно, можно сделать проще.
 * @todo: заюавно, что все равно вначале оно все равно обращается ко всем полям и все равно все создает.
 *
 * */
export class ApiManagerSingleton {
  static instance = undefined;
  #api = undefined;

  constructor() {
    if (ApiManagerSingleton.instance) {
      return ApiManagerSingleton.instance;
    } else {
      this.host = "";
      this.config = {};
      this.commonHeaders = {};
      this.axiosConfig = {};
    }
  }

  static getInstance() {
    if (ApiManagerSingleton.instance) {
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
    if (ApiManagerSingleton.instance)
      return ApiManagerSingleton.instance.api;
    else {
      throw new ShouldBeConfigured();
    }
  }

  get api() {
    return this.#api;
  }

  set api(apiRepository) {
    /**
     * @param {ApiRepository} target -
     * @param {string} name -
     *
     * @returns {BaseApiResource} Some object extends BaseApiResource.
     * */
    const proxyGetter = (target, name) => {
      // if (!(name in target)) {
      //   if (name in this.config) {
      //     Object.getPrototypeOf(target)[name] = new this.config[name](this.api.client);
      //   } else {
      //     throw new EndpointDoesNotExist(name, {target, config: this.config});
      //   }
      // }

      return target[name];
    }

    this.#api = new Proxy(apiRepository, {get: proxyGetter});
  }

  /**
   *
   * @param {string} [host] - baseUrl для axios конфига
   * @param {ApiEndpointsRepo} [config] - словарь с эндпоинтами
   * @param {object | Function} commonHeaders - заголовки, которые *в теории* буду использоваться при каждом запросе.
   *  Если в качестве заголовков передать функцию, то она будет вызвана каждый раз при обращении к полю заголовков
   *  и результат будет использован в качестве заголовков.
   * @param {AxiosRequestConfig} [axiosConfig] - конфигурация axios
   * */
  static configure(host, config, commonHeaders, axiosConfig) {
    if (!ApiManagerSingleton.instance) {
      ApiManagerSingleton.instance = new ApiManagerSingleton();
    }
    const apiManager = ApiManagerSingleton.instance;

    apiManager.host = (host !== undefined)
      ? host
      : apiManager.host;

    apiManager.config = (config !== undefined)
      ? {...config}
      : apiManager.config;

    apiManager.commonHeaders = (commonHeaders !== undefined)
      ? commonHeaders
      : apiManager.commonHeaders;

    apiManager.axiosConfig = (axiosConfig !== undefined)
      ? {...axiosConfig}
      : apiManager.axiosConfig;

    // apiManager.api = new ApiRepository(
    //   apiManager.host,
    //   apiManager.commonHeaders,
    //   apiManager.axiosConfig
    // );
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
  ApiManagerSingleton.configure(host, config, headers, axiosConfig);

/** Uses to get configered api object for usage in any point of your app.
 *
 * Raises `ShouldBeConfigured` if called before call `configureApi`,
 * means api does not configured yet.
 *
 * @method getApi
 * */
export const getApi = () => ApiManagerSingleton.getApi();


/*
config = {
  commonResource: ("common/"), // use base class for resource
  customResource: ("custom/", CustomResourceKlass)
}


apiResource = {
  retrieve: () => string,
  list: () => string,
  create: () => string,
  delete: () => string,
  update: () => string,
}

apiResourceConsumer = {
  retrieve: () => AxiosPromise, // use `apiResource.retrieve`
  list: () => AxiosPromise, // use `apiResource.list`
  create: () => AxiosPromise, // etc...
  delete: () => AxiosPromise, // etc...
  update: () => AxiosPromise, // etc...
  _resource: apiResource // private
}

apiRepo = {
  commonResource: apiResourceConsumer,
  customResource: apiResourceConsumer,
}

apiManager = {
  api: apiRepo
}*/
