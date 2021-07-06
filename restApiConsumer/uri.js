/**
 * @description
 * Object provides some methods to construct URI-string for REST API actions.
 *
 * Some resources can have extra actions like this:
 * For **`api/v1/task/1/complete`** :
 * - `api/v1/` - is base URL,
 * - `task` - is resource,
 * - `1` - is entity ID,
 * - `complete` - is extra action to complete task.
 *
 *
 * @property {string} baseURL - The base URL for REST API. Any resources will
 *  calculate from there.
 */
export class URI {
  /**
   * @param {string} baseURL - The base URL for REST API.
   * */
  constructor(baseURL) {
    this.baseURL = url.endsWith("/") ? baseURL : baseURL + "/";
  }

  /**
   * @param {number | string} entityId - Entity ID for REST API resource.
   * @param {string} [extraAction] - Any extra action for entity
   * @param {object} [options] - URI options
   *
   * @returns {string}
   * */
  retrieve(entityId, extraAction, options) {
    const parsedOptions = this.parseOptions(options);

    return extraAction
      ? `${this.baseURL}${entityId}/${extraAction}/${parsedOptions}`
      : `${this.baseURL}${entityId}/${parsedOptions}`;
  }

  /**
   * @param {object} [options] -
   * @param {string} [extraAction] -
   *
   * @returns {string}
   * */
  list(options, extraAction) {
    const parsedOptions = this.parseOptions(options);

    return extraAction
      ? `${this.baseURL}${extraAction}/${parsedOptions}`
      : `${this.baseURL}${parsedOptions}`;
  }

  /** Shortcut for assembly create-url.
   *
   * @returns {string}
   * */
  create() {
    return this.retrieve("");
  }

  /** Shortcut for assembly update-url.
   *
   * @param {number | string} entityId - Entity ID for REST API endpoint.
   *
   * @returns {string}
   * */
  update(entityId) {
    return this.retrieve(entityId);
  }

  /** Shortcut for assembly delete-url.
   *
   * @param {number | string} entityId - Entity ID for REST API endpoint.
   *
   * @returns {string}
   * */
  delete(entityId) {
    return this.retrieve(entityId);
  }

  /** Options parser. Usually should not be overloaded.
   *
   * @protected
   *
   * @param {object} [options={}] -
   *
   * @returns {string}
   * */
  parseOptions(options = {}) {
    let parsedOptions = Object.entries(options)
      .filter(([k, v]) => Boolean(v))
      .map((opt) => opt.join("="))
      .join("&");

    parsedOptions = parsedOptions ? "?" + parsedOptions : "";

    return parsedOptions;
  };
}