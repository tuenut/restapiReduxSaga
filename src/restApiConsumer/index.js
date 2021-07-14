import {ApiManagerSingleton} from "./manager";


/** Config for `api`-object.
 * Describes how you configure api resource: name of property, url-path, and
 *  does it has custom behavior through custom `ApiResource`-class.
 *
 * @typedef ApiConfig
 * @property {string} name - Name of api resource. Uses as name of `api`-object
 *  property, also may be url-path if `path`-parameter does not provided.
 * @property {string} [path] - Url-path for RESTApi resource. Can be ommited.
 * @property {ApiResource} [_class] - Your custom class for api resource.
 *  Should be extends by `ApiResource`.
 * */


/** Uses to configure api.
 *
 * @method configureApi
 *
 * @param {string} [host] - `baseUrl`-parameter for axios.
 * @param {Array<string|ApiConfig>} [config] - api resources config list.
 *  List element can be `string` for default behavior or may be customized
 *  with `ApiConfig`-objects.
 * @param {object | Function} [commonHeaders] - Request headers for axios.
 *  If pass function, then it will be call every time, when requst performed
 *  to get dynamically generated headers.
 * @param {AxiosRequestConfig} [axiosConfig] - Configuration for axios.
 *  Headers part will merge with `commonHeaders` and `commonHeaders` will
 *  override axios config headers with same names.
 * */
export const configureApi = (host, config, headers, axiosConfig) =>
  ApiManagerSingleton.getInstance().configure(host, config, headers, axiosConfig);

/** Uses to get configured `api`-object for usage in any point of your app.
 *
 * @method getApi
 *
 * @throws {ShouldBeConfigured} If called before `configureApi` calls throws
 *  `ShouldBeConfigured`, means api does not configured yet.
 *
 * @example
 * // In that example we have three resources from RESTApi server:
 * //  customers, products and orders.
 * // Each resource implements standart CRUD methods also `orders` provide
 * //  extra method `complete` to completes order by its id.
 *
 * class OrderResourceWithCompleteAction extends ApiResource {
 *  complete(id) {
 *    return this.request("retrieve", this.url.retrieve(id, "complete"));
 *  }
 * }
 *
 * configure(
 *  "http://example.com/",
 *  [
 *    "customers",
 *    {
 *      name: "orders",
 *      path: "customer-orders/",
 *      _class: OrderResourceWithCompleteAction
 *    },
 *   {name: "products", path: "products"},
 *  ],
 * )
 * const api = getAPi();
 *
 * api.customers.retrieve(42);
 * api.orders.create([{id: 1, qty: 10}, {id:2, qty: 1}]);
 * api.orders.delete(10);
 * api.orders.complete(1);
 * */
export const getApi = () => ApiManagerSingleton.getApi();

