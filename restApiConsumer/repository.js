import axios, {AxiosInstance, AxiosRequestConfig} from "axios";


/**
 * @public {AxiosInstance} client
 * */
export class ApiRepository {
  #headers = undefined;

  /**
   * @param {string} host -
   * @param {object} [headers={}] -
   * @param {AxiosRequestConfig} [axiosConfig={}] -
   * */
  constructor(host, headers = {}, axiosConfig) {
    this.host = host;
    this.headers = headers;

    this.client = axios.create({
      baseURL: this.host,
      headers: this.headers,
      ...axiosConfig
    })
  }

  get headers() {
    return (this.#headers instanceof Function) ? this.#headers() : {...this.#headers};
  }

  set headers(headers) {
    this.#headers = (headers instanceof Function) ? headers : {...headers};
  }
}