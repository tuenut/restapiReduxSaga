import {AxiosError, AxiosResponse} from "axios";


/**
 * @todo: must be removed, because ApiConsumer should not handle any data,
 * @todo: only send requests and returns its as is.
 * @todo: Redus-redusers should handle data
 * */
export class DataHandler {
  /**
   * @param [AxiosResponse] response
   * @return {AxiosResponse}
   * */
  defaultOnSuccess = (response) => response;

  /**
   * @param [AxiosError] response
   * @return {AxiosError}
   * */
  defaultOnError = (error) => error;
}