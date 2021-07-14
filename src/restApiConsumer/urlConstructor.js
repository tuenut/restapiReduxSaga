/**
 * @classdesc Class provides some methods to construct URI-string for REST API
 * actions. Some resources can have extra actions like this:
 * For **`api/v1/task/1/complete`** :
 * - `api/v1/` - is base URL,
 * - `task` - is resource,
 * - `1` - is entity ID,
 * - `complete` - is extra action to complete task.
 *
 *
 * @property {string} resourcePath - The resource path for REST API. 
 */
export class UrlConstructor {
  #resourcePath = undefined;
  
  /**
   * @param {string} resourcePath - The resource path for REST API.
   * */
  constructor(resourcePath) {
    this.#resourcePath = resourcePath.endsWith("/") ? resourcePath : resourcePath + "/";
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
      ? `${this.#resourcePath}${entityId}/${extraAction}/${parsedOptions}`
      : `${this.#resourcePath}${entityId}/${parsedOptions}`;
  }

  /**
   * @param {object} [options] - URI options
   * @param {string} [extraAction] - Any extra action for entity list
   *
   * @returns {string}
   * */
  list(options, extraAction) {
    const parsedOptions = this.parseOptions(options);

    return extraAction
      ? `${this.#resourcePath}${extraAction}/${parsedOptions}`
      : `${this.#resourcePath}${parsedOptions}`;
  }

  /** Shortcut for assembly create-url.
   *
   * @returns {string}
   * */
  create() {
    return this.#resourcePath;
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
   * @param {object} [options={}] - options dict
   *
   * @returns {string} Options parsed into URI-options string
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