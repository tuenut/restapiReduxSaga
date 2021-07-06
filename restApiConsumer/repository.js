import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

import {ApiEndpointsRepo} from "./types";

/**
 * @class
 * @classdesc
 *
 * @property {string} host -
 * @protected {object | Function} __headers -
 * */
export class ApiRepoBase {
  /**
   * @param {string} host -
   * @param {object | Function} headers -
   * */
  constructor(host, headers) {
    this.host = host;
    this.headers = headers;
  }

  get headers() {
    return (this.__headers instanceof Function) ? this.__headers() : {...this.__headers};
  }

  set headers(headers) {
    this.__headers = (headers instanceof Function) ? headers : {...headers};
  }
}

/**
 * @public {AxiosInstance} client
 * */
export class ApiRepo extends ApiRepoBase {
  /**
   * @param {string} host -
   * @param {object = {}} headers -
   * @param {AxiosRequestConfig = {}} axiosConfig -
   * */
  constructor(host, headers = {}, axiosConfig) {
    super(host, headers);

    this.client = axios.create({
      baseURL: this.host,
      headers: this.headers,
      ...axiosConfig
    })
  }
}