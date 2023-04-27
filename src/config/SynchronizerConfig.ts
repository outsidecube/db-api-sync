import { AuthHandler } from "../auth/AuthHandler"
import { BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher"
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { HTTPResponseProcessor } from "../fetcher/HTTPResponseProcessor";
import { RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { TimestampFieldRevisionHandlerConfig } from "../fetcher/TimestampFieldRevisionHandler";
import { DBImplementation } from "../storage/DBImplementation";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { SQLFieldMappingStorageConfig } from "../storage/SQLFieldMappingStorage";

export type AuthHandlerType = "BearerAuthHandler" | AuthHandler;
export type FetcherType = "RESTEntityFetcher" | AbstractEntityFetcher;
export type EntityLocalStorageType = "SQLFieldMapping" | EntityLocalStorage;
export type FetchRevisionHandlerType = "TimestampFieldRevisionHandler" | FetchRevisionHandler;
export type Formatter = (input: unknown) => unknown;
export type EntityLocalStorageConfig = {
  entityLocalStorage: EntityLocalStorageType,
  config: SQLFieldMappingStorageConfig | unknown
}
export type FetcherConfig = {
  fetcher: FetcherType,
  config: RESTEntityFetcherConfig | unknown
}
export type EntityDefConfig = {
  fetcher: FetcherConfig,
  name: string,
  sendable?: boolean,
  fetchable?: boolean,
  deletable?: boolean,
  authorization?: AuthorizationConfig,
  /**
 * The name of the Fetch Revision Handler defined globally. It can also be a entire definition of a specific FetchRevisionHandler
 */
  revisionHandler?: string | FetchRevisionHandlerConfig,
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
export type FormatterConfig = {
  name: string,
  formatter: Formatter
}
export type HTTPResponseProcessorConfig = {
  name: string,
  httpResponseProcessor: HTTPResponseProcessor
}
export type SynchronizerConfig = {
  baseURI: string,
  entityDefs: Array<EntityDefConfig>,
  authorization: AuthorizationConfig,
  revisionHandlers: Array<FetchRevisionHandlerConfig>,
  formatters?: Array<FormatterConfig>,
  httpResponseProcessors?: Array<HTTPResponseProcessorConfig>
  globalDBImplementation?: DBImplementation,
}