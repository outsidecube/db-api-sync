import { AuthHandler } from "../auth/AuthHandler"
import { BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { EntityFilter } from "../core/EntityDef";
import { AbstractDeletionDetector } from "../deletion/AbstractDeletionDetector";
import { HTTPDeletionResponseProcessor } from "../deletion/HTTPDeletionResponseProcessor";
import { RESTEntityDeletionConfig } from "../deletion/RESTEntityDeletionDetector";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher"
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { HTTPResponseProcessor } from "../fetcher/HTTPResponseProcessor";
import { RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { TimestampFieldRevisionHandlerConfig } from "../fetcher/TimestampFieldRevisionHandler";
import { AbstractEntitySender } from "../sender/AbstractEntitySender";
import { FieldValueChangeDetectorConfig } from "../sender/FieldValueChangeDetector";
import { LocalChangeDetector } from "../sender/LocalChangeDetector";
import { RESTEntitySenderConfig } from "../sender/RESTEntitySender";
import { DBImplementation } from "../storage/DBImplementation";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { SQLFieldMappingStorageConfig } from "../storage/SQLFieldMappingStorage";

export type AuthHandlerType = "BearerAuthHandler" | AuthHandler;
export type FetcherType = "RESTEntityFetcher" | AbstractEntityFetcher;
export type DeletionDetectorType = "RESTEntityDeletionDetector" | AbstractDeletionDetector;
export type SenderType = "RESTEntitySender" | AbstractEntitySender;
export type LocalChangeDetectorType = "FieldValueChangeDetector" | LocalChangeDetector;

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
export type DeletionDetectorConfig = {
  deletionDetector: DeletionDetectorType,
  config: RESTEntityDeletionConfig | unknown
}
export type LocalChangeDetectorConfig = {
  localChangeDetector: LocalChangeDetectorType,
  config?: FieldValueChangeDetectorConfig | unknown
}
export type SenderConfig = {
  sender: SenderType,
  config?: RESTEntitySenderConfig | unknown
}
export type EntityDefConfig = {
  fetcher?: FetcherConfig,
  sender?: SenderConfig,
  name: string,
  sendable?: boolean,
  fetchable?: boolean,
  deletable?: boolean,
  percentWeight?: number,
  fetchFilter?: EntityFilter,
  deletionDetector?: DeletionDetectorConfig
  authorization?: AuthorizationConfig,
  localChangeDetector?: LocalChangeDetectorConfig,
  /**
 * The name of the Fetch Revision Handler defined globally. It can also be a entire definition of a specific FetchRevisionHandler
 */
  revisionHandler?: string | FetchRevisionHandlerConfig,
  deleteRevisionHandler?: string | FetchRevisionHandlerConfig,
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
export type HTTPDeletionResponseProcessorConfig = {
  name: string,
  httpDeletionResponseProcessor: HTTPDeletionResponseProcessor
}
export type SynchronizerConfig = {
  baseURI: string,
  entityDefs: Array<EntityDefConfig>,
  authorization: AuthorizationConfig,
  revisionHandlers: Array<FetchRevisionHandlerConfig>,
  formatters?: Array<FormatterConfig>,
  httpResponseProcessors?: Array<HTTPResponseProcessorConfig>
  httpDeletionResponseProcessors?: Array<HTTPDeletionResponseProcessorConfig>
  globalDBImplementation?: DBImplementation,
}