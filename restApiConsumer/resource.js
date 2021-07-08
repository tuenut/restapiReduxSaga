import {AxiosInstance, AxiosPromise} from "axios";

import {URI} from "./uri";


/** Base class for REST API resource.
 * Common REST API methods already implemented there. It can be enough to use.
 *
 * @class BaseApiResource
 *
 * @property {AxiosInstance} client
 * @property {URI} url
 *
 * */
export class BaseApiResource {
  #url = undefined;

  /**
   * @todo: надо допилить в конфигураторе, чтобы урл и заголовки получались из
   * @todo: конфига и с ними класс инициалицизовался. Или типа того.
   *
   * @param {AxiosInstance} client -
   * @param {string} [url=""] -
   * */
  constructor(client, url = "") {
    this.client = client;

    this.url = url;
  }

  /**
   * @returns {URI}
   * */
  get url() {
    return this.#url;
  }

  /** Setter can receive string or URI object.
   * You can pass just string and it may be enough.
   *
   * @param {string | URI} value
   * */
  set url(value) {
    this.#url = typeof value === "string" ? new URI(value) : value;
  }

  /**
   * @param {number | string} id - Id of entity.
   * @param {string} [extraAction=""] - Name of extra action for endpoint.
   * @param {object} [options]
   *
   * @returns {AxiosPromise} AxiosPromise without catch statement.
   * */
  retrieve(id, extraAction, options) {
    return this.client
      .get(this.url.retrieve(id, extraAction, options))
      .then(this.handlers.onSuccessRetrieve)
  }

  /**
   * @param {object} [options] - REST API otions.
   * @param {string} [extraAction] -
   *
   * @returns {AxiosPromise} AxiosPromise without catch statement.
   * */
  list(options, extraAction) {
    return this.client
      .get(this.url.list(options, extraAction))
      .then(this.handlers.onSuccessList)
  }

  /**
   * @param {object} data - Data for create new object.
   *
   * @returns {AxiosPromise} - AxiosPromise without catch statement.
   * */
  create(data) {
    return this.client
      .post(this.url.create(), data)
      .then(this.handlers.onSuccessCreate)
  }

  /**
   * @param {number | string} id - Id of entity.
   * @param {object} data - Data for update object.
   *
   * @returns {AxiosPromise} AxiosPromise without catch statement.
   * */
  update(id, data) {
    return this.client
      .put(this.url.update(id), data)
      .then(this.handlers.onSuccessUpdate)
  }

  /**
   * @param {number | string} id - Id of entity.
   *
   * @returns {AxiosPromise} AxiosPromise without catch statement.
   * */
  delete(id) {
    return this.client
      .delete(this.url.delete(id))
      .then(this.handlers.onSuccessDelete)
  }

  /**
   * @param {object} [fakeData] - that data will be returned from endpoint
   * @param {number} [delay] - optional delay to simulate real dealy between
   *  request and response.
   *
   * @returns {Promise}
   * */
  fakeEndpoint(
    fakeData = {message: "This is fake data."},
    delay = 500
  ) {
    const fakedPromise = new Promise((resultHandler, reject) => {
      setTimeout(
        (value) => resultHandler({data: {...fakeData}}),
        delay
      );
    });

    return fakedPromise;
  }
}