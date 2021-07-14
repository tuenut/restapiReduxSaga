import axios from "axios";

import {ApiResource} from "./resource.js";


/**
 * @classdesc Api resorces repository object. It has some configuration
 * and provides `request` method for each resources it can be contained.
 *
 * @property {string} host - RESTApi server host URL, like an `https://example.com/`.
 * @property {object} headers - optional headers. Can be a Function, wich
 *  should be called before any request and adds result as headers to request.
 * @property {AxiosInstance} client - axios client.
 * */
export class ApiRepository {
  #headers = undefined;

  /**
   * @param {string} host -
   * @param {object} [headers={}] -
   * @param {AxiosRequestConfig} [axiosConfig={}] -
   * */
  constructor(host, headers = {}, axiosConfig = {}) {
    this.host = host;
    this.headers = headers;

    this.client = axios.create({
      baseURL: this.host,
      headers: this.headers,
      ...axiosConfig
    })
  }

  get headers() {
    let headersReturned = this.client
      ? {...this.client.defaults.headers}
      : {};

    return {
      ...headersReturned,
      ...(
        this.#headers instanceof Function
          ? this.#headers()
          : this.#headers
      )
    };
  }

  set headers(headers) {
    this.#headers = (headers instanceof Function)
      ? headers
      : {...headers};
  }

  /** Method uses by ApiMAnager in configuration stage.
   *
   * @param {string | object} resource - Resource name, uses as attribute name for
   *  ApiRepository instance, also uses as resource name in URL-path.
   *  You can pass resource as object, where `name` for resource name and
   *  `path` for resource path.
   * @param {ApiResource} [CustomResourceKlass] - You can use your own custom
   *  class wich can provide additional(shortcut) methods or has custom behavior.
   * */
  createResource(name, resourcePath, CustomResourceKlass) {
    const requestMethod = this.request.bind(this);

    resourcePath = resourcePath ? resourcePath : name;

    const resourceRepositiry = CustomResourceKlass
      ? new CustomResourceKlass(requestMethod, resourcePath)
      : new ApiResource(requestMethod, resourcePath);

    this[name] = resourceRepositiry;
  }

  /**
   * @name requestMethod
   * @function
   * @memberOf ApiRepository
   *
   * @param {string} type - RESTApi request type can be one of
   *  ["retrieve", "list", "create", "delete", "update", "partialUpdate"].
   *  For `partialUpdate` you must implement your own resource class wich will
   *  use that method.
   * @param {string} url - should be generated by UrlConstructor.
   * @param {object} [data={}] - optional and uses for
   *  ["create", "update", "partialUpdate"].
   *
   * @returns {Promise}
   * */
  request(type, url, data = {}) {
    const config = this.#headers
      ? {...this.client.defaults, headers: this.headers}
      : this.client.defaults;

    switch (type) {
      case "retrieve":
        return this.client.get(url, config);

      case "list":
        return this.client.get(url, config);

      case "create":
        return this.client.post(url, data, config);

      case "delete":
        return this.client.delete(url, config);

      case "update":
        return this.client.put(url, data, config);

      case "partialUpdate":
        return this.client.patch(url, data, config);

      default:
        throw new Error("Invalid request type.")
    }
  }
}