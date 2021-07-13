import {ApiManagerSingleton} from "./manager";


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
  ApiManagerSingleton.getInstance().configure(host, config, headers, axiosConfig);

/** Uses to get configered api object for usage in any point of your app.
 *
 * Raises `ShouldBeConfigured` if called before call `configureApi`,
 * means api does not configured yet.
 *
 * @method getApi
 * */
export const getApi = () => ApiManagerSingleton.getApi();

