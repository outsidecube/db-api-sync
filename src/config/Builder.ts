import { AuthHandler } from "../auth/AuthHandler";
import { BearerAuthHandler, BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { EntityDef } from "../core/EntityDef";
import { Synchronizer } from "../core/Synchronizer";
import { AbstractDeletionDetector } from "../deletion/AbstractDeletionDetector";
import { HTTPDeletionResponseProcessor } from "../deletion/HTTPDeletionResponseProcessor";
import { RESTEntityDeletionConfig, RESTEntityDeletionDetector } from "../deletion/RESTEntityDeletionDetector";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { HTTPResponseProcessor } from "../fetcher/HTTPResponseProcessor";
import { RESTEntityFetcher, RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { TimestampFieldRevisionHandler, TimestampFieldRevisionHandlerConfig } from "../fetcher/TimestampFieldRevisionHandler";
import { AbstractEntitySender } from "../sender/AbstractEntitySender";
import { FieldValueChangeDetector, FieldValueChangeDetectorConfig } from "../sender/FieldValueChangeDetector";
import { HTTPRequestProcessor } from "../sender/HTTPRequestProcessor";
import { LocalChangeDetector } from "../sender/LocalChangeDetector";
import { RESTEntitySender, RESTEntitySenderConfig } from "../sender/RESTEntitySender";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { SQLFieldMappingStorage, SQLFieldMappingStorageConfig } from "../storage/SQLFieldMappingStorage";
import { AuthorizationConfig, DeletionDetectorConfig, EntityDefConfig, EntityLocalStorageConfig, FetcherConfig, FetchRevisionHandlerConfig, Formatter, FormatterConfig, HTTPDeletionResponseProcessorConfig, HTTPResponseProcessorConfig, LocalChangeDetectorConfig, SenderConfig, SynchronizerConfig } from "./SynchronizerConfig";

export function buildAuthHandler(authorization: AuthorizationConfig): AuthHandler {
  if (authorization.handler === "BearerAuthHandler") {
    return new BearerAuthHandler((authorization.config as BearerAuthHandlerConfig).token);
  }
  return authorization.handler;

}

export function buildFetchRevisionHandler(fetchConfig: FetchRevisionHandlerConfig, synchronizer: Synchronizer): FetchRevisionHandler {
  let fetchRevisionHandler: FetchRevisionHandler;
  if (typeof fetchConfig.revisionHandler === 'string') {
    if (fetchConfig.revisionHandler === "TimestampFieldRevisionHandler") {
      const config: TimestampFieldRevisionHandlerConfig = fetchConfig.config as TimestampFieldRevisionHandlerConfig;
      let formatter: Formatter | undefined;
      if (config.parameterFormatter) {
        if (typeof config.parameterFormatter === 'string') {
          formatter = synchronizer.formatters.get(config.parameterFormatter)
          if (!formatter) {
            throw new Error(`Invalid formatter ${config.parameterFormatter}`)
          }
        } else {
          formatter = config.parameterFormatter
        }
      }
      fetchRevisionHandler = new TimestampFieldRevisionHandler(config.timestampFieldName, config.timestampParameterName, formatter);
    } else {
      throw new Error(`Invalid fetch revision handler type: ${fetchConfig.revisionHandler}`)
    }
  } else if (fetchConfig.revisionHandler instanceof FetchRevisionHandler) {
    fetchRevisionHandler = fetchConfig.revisionHandler;
  } else {
    throw new Error(`Invalid fetch revision handler type: ${fetchConfig.revisionHandler}`)
  }

  return fetchRevisionHandler;

}
export function buildSender(senderConfig: SenderConfig): AbstractEntitySender {
  let sender: AbstractEntitySender;
  if (typeof senderConfig.sender === 'string') {
    if (senderConfig.sender === "RESTEntitySender") {
      const config: RESTEntitySenderConfig = senderConfig.config as RESTEntitySenderConfig;
      const httpRequestProcessor: HTTPRequestProcessor = config.requestProcessor;
      if (!httpRequestProcessor) {
        throw new Error(`No RequestProcessor for sender ${JSON.stringify(senderConfig)}`)
      }
      sender = new RESTEntitySender(config.uriPath, httpRequestProcessor, config.method, config.additionalQueryParams);
    } else {
      throw new Error(`Invalid sender ${senderConfig.sender}`);
    }
  } else if (senderConfig.sender instanceof AbstractEntitySender) {
    sender = senderConfig.sender;
  } else {
    throw new Error(`Invalid sender ${senderConfig.sender}`);
  }

  return sender;
}
export function buildDeletionDetector(deletionDetectorConfig: DeletionDetectorConfig, synchronizer: Synchronizer): AbstractDeletionDetector {
  let deletionDetector: AbstractDeletionDetector;
  if (typeof deletionDetectorConfig.deletionDetector === 'string') {
    if (deletionDetectorConfig.deletionDetector === "RESTEntityDeletionDetector") {
      const config: RESTEntityDeletionConfig = deletionDetectorConfig.config as RESTEntityDeletionConfig;
      let httpDeletionResponseProcessor: HTTPDeletionResponseProcessor | undefined;
      if (typeof config.responseProcessor === 'string') {
        httpDeletionResponseProcessor = synchronizer.httpDeletionResponseProcessors.get(config.responseProcessor);
      } else {
        httpDeletionResponseProcessor = config.responseProcessor
      }
      if (!httpDeletionResponseProcessor) {
        throw new Error(`No responseProcessor for deletionDetector ${JSON.stringify(deletionDetectorConfig)}`)
      }
      deletionDetector = new RESTEntityDeletionDetector(config.uriPath, httpDeletionResponseProcessor, config.method, config.additionalQueryParams);
    } else {
      throw new Error(`Invalid deletionDetector ${deletionDetectorConfig.deletionDetector}`);
    }
  } else if (deletionDetectorConfig.deletionDetector instanceof AbstractDeletionDetector) {
    deletionDetector = deletionDetectorConfig.deletionDetector;
  } else {
    throw new Error(`Invalid deletion detector ${deletionDetectorConfig.deletionDetector}`);
  }

  return deletionDetector;
}

export function buildFetcher(fetcherConfig: FetcherConfig, synchronizer: Synchronizer): AbstractEntityFetcher {
  let fetcher: AbstractEntityFetcher;
  if (typeof fetcherConfig.fetcher === 'string') {
    if (fetcherConfig.fetcher === "RESTEntityFetcher") {
      const config: RESTEntityFetcherConfig = fetcherConfig.config as RESTEntityFetcherConfig;
      let httpResponseProcessor: HTTPResponseProcessor | undefined;
      if (typeof config.responseProcessor === 'string') {
        httpResponseProcessor = synchronizer.httpResponseProcessors.get(config.responseProcessor);
      } else {
        httpResponseProcessor = config.responseProcessor
      }
      if (!httpResponseProcessor) {
        throw new Error(`No ResponseProcessor for fetcher ${JSON.stringify(fetcherConfig)}`)
      }
      fetcher = new RESTEntityFetcher(config.uriPath, httpResponseProcessor, config.method, config.additionalQueryParams);
    } else {
      throw new Error(`Invalid fetcher ${fetcherConfig.fetcher}`);
    }
  } else if (fetcherConfig.fetcher instanceof AbstractEntityFetcher) {
    fetcher = fetcherConfig.fetcher;
  } else {
    throw new Error(`Invalid fecther ${fetcherConfig.fetcher}`);
  }

  return fetcher;
}

export function buildLocalChangeDetector(localChangeDetectorConfig: LocalChangeDetectorConfig): LocalChangeDetector {
  let localChangeDetector: LocalChangeDetector;
  if (typeof localChangeDetectorConfig.localChangeDetector === 'string') {
    if (localChangeDetectorConfig.localChangeDetector === "FieldValueChangeDetector") {
      const config: FieldValueChangeDetectorConfig = localChangeDetectorConfig.config as FieldValueChangeDetectorConfig;
      localChangeDetector = new FieldValueChangeDetector(config.field, config.value, config.valueAfterSync);
    } else {
      throw new Error(`Invalid LocalChangeDetector ${localChangeDetectorConfig.localChangeDetector}`);
    }
  } else if (localChangeDetectorConfig.localChangeDetector instanceof LocalChangeDetector) {
    localChangeDetector = localChangeDetectorConfig.localChangeDetector;
  } else {
    throw new Error(`Invalid localChangeDetector ${localChangeDetectorConfig.localChangeDetector}`);
  }

  return localChangeDetector;
}
export function buildEntityLocalStorage(config: EntityLocalStorageConfig, synchronizer: Synchronizer): EntityLocalStorage {
  let entityLocalStorage: EntityLocalStorage;
  if (typeof config.entityLocalStorage === 'string') {
    if (config.entityLocalStorage === "SQLFieldMapping") {
      const sqlConfig: SQLFieldMappingStorageConfig = config.config as SQLFieldMappingStorageConfig;
      entityLocalStorage = new SQLFieldMappingStorage(sqlConfig.tableName, sqlConfig.idFieldName,
        sqlConfig.dbImplementation || synchronizer.globalDBImplementation, sqlConfig.mappings, sqlConfig.preProcessor,
        sqlConfig.postProcessor)

    } else {
      throw new Error(`Invalid EntityLocalStorage ${config.entityLocalStorage}`)
    }
  } else if (config.entityLocalStorage instanceof EntityLocalStorage) {
    entityLocalStorage = config.entityLocalStorage;
  } else {
    throw new Error(`Invalid EntityLocalStorage ${config.entityLocalStorage}`)
  }
  return entityLocalStorage;
}
export function configureFetchRevisionHandler(revisionHandlerConfig: string | FetchRevisionHandlerConfig, synchronizer: Synchronizer) {
  let revisionHandler: FetchRevisionHandler | undefined;
  if (typeof revisionHandlerConfig === 'string') {
    revisionHandler = synchronizer.fetchRevisionHandlers.get(revisionHandlerConfig);
    if (!revisionHandler) {
      throw new Error(`No FetchRevisionHandler found for name ${revisionHandlerConfig}`)
    }
  } else if (typeof revisionHandlerConfig === 'object') {
    try {
      revisionHandler = buildFetchRevisionHandler(revisionHandlerConfig as FetchRevisionHandlerConfig, synchronizer);
    } catch (err) {
      throw new Error(`Couldnt build FetchRevisionHandler for EntityDef: ${err}`)
    }
  }
  return revisionHandler;
}
export function buildEntityDefs(config: SynchronizerConfig, synchronizer: Synchronizer): Map<string, EntityDef> {
  const entityDefs = new Map<string, EntityDef>();
  config.entityDefs.forEach(e => {
    const entityDef = new EntityDef();
    if (e.authorization) {
      entityDef.authHandler = buildAuthHandler(e.authorization)
    } else {
      entityDef.authHandler = synchronizer.authHandler
    }
    entityDef.percentWeight = e.percentWeight || 1;
    entityDef.fetchFilter = e.fetchFilter;
    if (e.fetcher) {
      entityDef.fetcher = buildFetcher(e.fetcher, synchronizer);
    }
    if (e.sender) {
      entityDef.sender = buildSender(e.sender);
    }
    if (e.localChangeDetector) {
      entityDef.localChangeDetector = buildLocalChangeDetector(e.localChangeDetector);
    }
    if (e.deletionDetector) {
      entityDef.deletionDetector = buildDeletionDetector(e.deletionDetector, synchronizer);
    }
    entityDef.localStorage = buildEntityLocalStorage(e.localStorage, synchronizer);
    if (e.revisionHandler) {
      entityDef.fetchRevisionHandler = configureFetchRevisionHandler(e.revisionHandler, synchronizer);
    }
    if (e.deleteRevisionHandler) {
      entityDef.deleteRevisionHandler = configureFetchRevisionHandler(e.deleteRevisionHandler, synchronizer);
    }
    entityDef.config = config;
    entityDef.name = e.name;
    entityDef.sendable = e.sendable;
    entityDef.fetchable = e.fetchable;
    entityDef.deletable = e.deletable;
    entityDefs.set(e.name, entityDef);
  })
  return entityDefs;
}

function buildFetchRevisionHandlers(revisionHandlers: FetchRevisionHandlerConfig[], synchronizer: Synchronizer): Map<string, FetchRevisionHandler> {
  const m = new Map<string, FetchRevisionHandler>()
  revisionHandlers.forEach(fetchConfig => {
    const fetchHandler: FetchRevisionHandler = buildFetchRevisionHandler(fetchConfig, synchronizer);
    if (!fetchConfig.name) {
      throw new Error(`Invalid fetcher revision handler config without name ${fetchConfig}`)
    }
    m.set(fetchConfig.name, fetchHandler);
  })
  return m;
}

function buildFormatters(formatters: FormatterConfig[]): Map<string, Formatter> {
  const m = new Map<string, Formatter>();
  formatters.forEach(formatterConfig => {
    m.set(formatterConfig.name, formatterConfig.formatter);
  })
  return m;
}

function buildHTTPResponseProcessors(httpResponseProcessors: HTTPResponseProcessorConfig[]): Map<string, HTTPResponseProcessor> {
  const m = new Map<string, HTTPResponseProcessor>();
  httpResponseProcessors.forEach(httpResponseProcessorConfig => {
    m.set(httpResponseProcessorConfig.name, httpResponseProcessorConfig.httpResponseProcessor);
  })
  return m;
}

function buildHTTPDeletionResponseProcessors(httpDeletionResponseProcessors: HTTPDeletionResponseProcessorConfig[]): Map<string, HTTPDeletionResponseProcessor> {
  const m = new Map<string, HTTPDeletionResponseProcessor>();
  httpDeletionResponseProcessors.forEach(httpDeletionResponseProcessorConfig => {
    m.set(httpDeletionResponseProcessorConfig.name, httpDeletionResponseProcessorConfig.httpDeletionResponseProcessor);
  })
  return m;
}

export function buildSynchronizer(config: SynchronizerConfig): Synchronizer {
  const synchronizer = new Synchronizer(config);
  synchronizer.authHandler = buildAuthHandler(config.authorization);
  synchronizer.globalDBImplementation = config.globalDBImplementation;
  if (config.formatters) {
    synchronizer.formatters = buildFormatters(config.formatters)
  }
  if (config.httpResponseProcessors) {
    synchronizer.httpResponseProcessors = buildHTTPResponseProcessors(config.httpResponseProcessors)
  }
  if (config.httpDeletionResponseProcessors) {
    synchronizer.httpDeletionResponseProcessors = buildHTTPDeletionResponseProcessors(config.httpDeletionResponseProcessors);
  }
  synchronizer.fetchRevisionHandlers = buildFetchRevisionHandlers(config.revisionHandlers, synchronizer);
  const entityDefs = buildEntityDefs(config, synchronizer);
  synchronizer.entityDefs = entityDefs;
  return synchronizer;
}
