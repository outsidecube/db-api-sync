import { AuthHandler } from "../auth/AuthHandler"
import { BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher"
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { TimestampFieldRevisionHandlerConfig } from "../fetcher/TimestampFieldRevisionHandler";
import { DBImplementation } from "../storage/DBImplementation";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { SQLFieldMappingStorageConfig } from "../storage/SQLFieldMappingStorage";

export type AuthHandlerType = "BearerAuthHandler" | AuthHandler;
export type FetcherType = "RESTEntityFetcher" | AbstractEntityFetcher;
export type EntityLocalStorageType = "SQLFieldMapping" | EntityLocalStorage;
export type FetchRevisionHandlerType = "TimestampFieldRevisionHandler" | FetchRevisionHandler;
export type EntityLocalStorageConfig = {
  entityLocalStorage: EntityLocalStorageType,
  config: SQLFieldMappingStorageConfig | unknown
}
export type FetcherConfig = {
  fetcher: FetcherType,
  /**
   * The name of the Fetch Revision Handler defined globally. It can also be a entire definition of a specific FetchRevisionHandler
   */
  revisionHandler: string | FetchRevisionHandlerConfig,
  config: RESTEntityFetcherConfig | unknown
}
export type EntityDefConfig = {
  fetcher: FetcherConfig,
  name: string,
  authorization?: AuthorizationConfig,
  localStorage: EntityLocalStorageConfig
}
export type AuthorizationConfig = {
  handler: AuthHandlerType,
  config: BearerAuthHandlerConfig | unknown
}
export type FetchRevisionHandlerConfig = {
  name?: string,
  revisionHandler?: FetchRevisionHandlerType,
  config: TimestampFieldRevisionHandlerConfig | unknown
}
export type SynchronizerConfig = {
  baseURI: string,
  entityDefs: Array<EntityDefConfig>,
  authorization: AuthorizationConfig,
  revisionHandlers: Array<FetchRevisionHandlerConfig>,
  generalDBImplementation?: DBImplementation
}