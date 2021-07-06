import {ApiRepo} from "./repository";


class EndpointDoesNotExist {
  name = "Endpoint {} does not exist!";
  object = null;

  constructor(endpointName, object) {
    this.name = this.name.replace('{}', endpointName);
    this.object = object;
  }
}

class ShouldBeConfigured {
  name = "Manager should be configured on first use `ApiManagerSingleton.getInstance`."

  constructor() {
  }
}


/**
 * @class ApiManagerSingleton
 * @classdesc
 *
 * @namespace
 * @property {ApiRepo} api - хранит объект репозитория Api, завернутый в Proxy.
 *    В прокси объекте используется перегруженный геттер.
 *    Прокси-геттер позволяет конструировать прототип объекта ApiProvider на лету.
 *     При обращении к несуществующему полю, будет произведена попытка найти
 *     одноименный эндпоинт в конфигурации эндпоинтов. Если такой эндпоинт найден,
 *     будет создан соответствующий экземпляр в поле прототипа.
 * @property {string} host -
 * @property {object | Function} commonHeaders -
 * @property {ApiEndpointsRepo} endpointsConfig -
 * @property {ApiManagerSingleton} _instance -
 *
 * @todo: надо как следует проработать это все. Вероятно, можно сделать проще.
 * @todo: заюавно, что все равно вначале оно все равно обращается ко всем полям и все равно все создает.
 *
 * */
class ApiManagerSingleton {

  private constructor() {
    this.host = "";
    this.endpointsConfig = {};
    this.commonHeaders = {};
  }

  /**
   * @method getInstance
   * Может быть вызван без параметров.
   *
   * @param {string} [host] - baseUrl для axios конфига
   * @param {ApiEndpointsRepo} [config] - словарь с эндпоинтами
   * @param {object | Function} commonHeaders - заголовки, которые *в теории* буду использоваться при каждом запросе.
   *  Если в качестве заголовков передать функцию, то она будет вызвана каждый раз при обращении к полю заголовков
   *  и результат будет использован в качестве заголовков.
   * @param {AxiosRequestConfig} [axiosConfig] - конфигурация axios
   *
   * @returns {ApiManagerSingleton} - инстанс апи менеджера(консумера)
   * */
  public static getInstance(host, config, commonHeaders, axiosConfig) {
    const hasArguments = (host !== undefined || config !== undefined || commonHeaders !== undefined);

    if (!ApiManagerSingleton._instance) {
      ApiManagerSingleton._instance = new ApiManagerSingleton();
    }

    if (hasArguments) {
      ApiManagerSingleton._instance.configure(host, config, commonHeaders, axiosConfig);
    }

    return ApiManagerSingleton._instance;
  }

  public static getApi(): ApiRepo {
    return ApiManagerSingleton._instance.api;
  }

  /**
   * @method configure
   *
   * @param {string} [host]
   * @param {ApiEndpointsRepo} [config]
   * @param {object | Function} [commonHeaders]
   * @param {AxiosRequestConfig} [axiosConfig]
   * */
  configure(host, config, commonHeaders, axiosConfig) {
    if (host !== undefined)
      this.host = host;
    if (config !== undefined)
      this.endpointsConfig = {...config};
    if (commonHeaders !== undefined)
      this.commonHeaders = commonHeaders;

    if (!(host && config && commonHeaders))
      return;

    const apiRepo = new ApiRepo(this.host, this.commonHeaders, axiosConfig);

    const proxyGetter = (target: ApiRepo, name: string) => {
      if (!(name in target)) {
        if (name in this.endpointsConfig) {
          Object.getPrototypeOf(target)[name] = new this.endpointsConfig[name](this.api.client);
        } else {
          throw new EndpointDoesNotExist(name, {target, config: this.endpointsConfig});
        }
      }

      return target[name];
    }

    this.api = new Proxy(apiRepo, {get: proxyGetter});
  }
}


export const configureApi = (host, config, headers, axiosConfig) =>
  ApiManagerSingleton.getInstance(host, config, headers, axiosConfig);

export const getApi = () => ApiManagerSingleton.getApi();
