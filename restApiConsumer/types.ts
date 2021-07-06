import {Endpoint} from "./endpoint";


export interface ApiEndpointsRepo<T=any> {
  [name: string]: T extends Endpoint ? T : Endpoint
}

export type idType = number | string;