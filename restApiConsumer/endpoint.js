import {AxiosInstance, AxiosPromise} from "axios";
import {DataHandler, IHandler} from "./dataHandler";
import {URI} from "./uriProvider";


/** Базовый абстрактный класс для апи-эндпоинтов.
 * Основные методы обращения к апи уже реализованы с базовым поведение.
 *
 * Для определения специфических хэндлеров для каждого метода, предполагается
 * явный вызов сеттера для конкретного хэндлера у объекта this.handlers. Можно
 * делать это в конструкторе наследника BaseApiEndpoint или в клиентском коде.
 * Как вариант можно делать отдельный класс, унаследованный от DataHandler и
 * использовать его.
 *
 * @property {AxiosInstance} client
 * @property {DataHandler} handlers
 * @property {URI} __url
 *
 * @example
 *  class Endpoint extends BaseApiEndpoint {
 *    constructor(client) {
 *      super(ENDPOINT_BASE_URL)
 *
 *      this.setUrl(currentEndpointUrl);
 *    }
 *  }
 * */
export class Endpoint {
  /**
   * @todo: надо допилить в конфигураторе, чтобы урл и заголовки получались из
   * @todo: конфига и с ними класс инициалицизовался. Или типа того.
   *
   * @param {AxiosInstance} client -
   * @param {string=""} [url] -
   * @param {DataHandler=null} [handlers] -
   * */
  constructor(client, url = "", handlers) {
    this.client = client;
    this.handlers = handlers ? handlers : new DataHandler();

    this.setUrl(url);
  }

  get url(): URI {
    return this.__url;
  }

  /**
   * @param {string | URI} value
   * */
  setUrl(value) {
    this.__url = typeof value === "string" ? new URI(value) : value;
  }

  /**
   * @method retrieve
   *
   * @param {number | string} id - Id of entity.
   * @param {string=""} [extraAction] - Name of extra action for endpoint.
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
   * @method  list
   *
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
   * @method create
   *
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
   * @method  update
   *
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
   * @method delete
   *
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
   * @deprecated should be removed [more info](./handler)
   * */
  setHandler(handler) {
    this.handlers.defaultOnSuccess = handler;

    return this;
  }

  /**
   * @deprecated should be removed [more info](./handler)
   * */
  setOnErrorHandler(handler: IHandler) {
    this.handlers.defaultOnError = handler;

    return this;
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