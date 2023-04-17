import { AuthHandler } from "../auth/AuthHandler"
import { BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher"
import { RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { DBImplementation } from "../storage/DBImplementation";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { SQLFieldMappingStorageConfig } from "../storage/SQLFieldMappingStorage";

export type AuthHandlerType = "BearerAuthHandler" | AuthHandler;
export type FetcherType = "RESTEntityFetcher" | AbstractEntityFetcher;
export type EntityLocalStorageType = "SQLFieldMapping" | EntityLocalStorage;

export type EntityLocalStorageConfig = {
  entityLocalStorage: EntityLocalStorageType,
  config: SQLFieldMappingStorageConfig | unknown
}
export type FetcherDef = {
  fetcher: FetcherType,
  config: RESTEntityFetcherConfig | unknown
}
export type EntityDefConfig = {
  fetcher: FetcherDef,
  name: string,
  authorization?: AuthorizationConfig,
  localStorage: EntityLocalStorageConfig
}
export type AuthorizationConfig = {
  handler: AuthHandlerType,
  config: BearerAuthHandlerConfig | unknown
}

export type SynchronizerConfig = {
  baseURI: string,
  entityDefs: Array<EntityDefConfig>,
  authorization: AuthorizationConfig,
  generalDBImplementation?: DBImplementation
}