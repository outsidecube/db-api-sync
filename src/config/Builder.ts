import { AuthHandler } from "../auth/AuthHandler";
import { BearerAuthHandler, BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { EntityDef } from "../core/EntityDef";
import { Synchronizer } from "../core/Synchronizer";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { HTTPResponseProcessor } from "../fetcher/HTTPResponseProcessor";
import { RESTEntityFetcher, RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { TimestampFieldRevisionHandler, TimestampFieldRevisionHandlerConfig } from "../fetcher/TimestampFieldRevisionHandler";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { SQLFieldMappingStorage, SQLFieldMappingStorageConfig } from "../storage/SQLFieldMappingStorage";
import { AuthorizationConfig, EntityDefConfig, EntityLocalStorageConfig, FetcherConfig, FetchRevisionHandlerConfig, Formatter, FormatterConfig, HTTPResponseProcessorConfig, SynchronizerConfig } from "./SynchronizerConfig";

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

export function buildFetcher(fetcherConfig: FetcherConfig, synchronizer: Synchronizer): AbstractEntityFetcher {
  let fetcher: AbstractEntityFetcher;
  if (typeof fetcherConfig.fetcher === 'string') {
    if (fetcherConfig.fetcher === "RESTEntityFetcher") {
      const config: RESTEntityFetcherConfig = fetcherConfig.config as RESTEntityFetcherConfig;
      let httpResponseProcessor:HTTPResponseProcessor|undefined;
      if (typeof config.responseProcessor ==='string' ) {
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
  if (fetcherConfig.revisionHandler) {
    let revisionHandler: FetchRevisionHandler | undefined;
    if (typeof fetcherConfig.revisionHandler === 'string') {
      revisionHandler = synchronizer.fetchRevisionHandlers.get(fetcherConfig.revisionHandler);
      if (!revisionHandler) {
        throw new Error(`No FetchRevisionHandler found for name ${fetcherConfig.revisionHandler}`)
      }
    } else if (typeof fetcherConfig.revisionHandler === 'object') {
      try {
        revisionHandler = buildFetchRevisionHandler(fetcherConfig.revisionHandler as FetchRevisionHandlerConfig, synchronizer);
      } catch (e) {
        throw new Error(`Couldnt build FetchRevisionHandler for fetcher ${fetcherConfig}: ${e}`)
      }
    }
  }
  return fetcher;
}

export function buildEntityLocalStorage(config: EntityLocalStorageConfig, synchronizer: Synchronizer): EntityLocalStorage {
  let entityLocalStorage: EntityLocalStorage;
  if (typeof config.entityLocalStorage === 'string') {
    if (config.entityLocalStorage === "SQLFieldMapping") {
      const sqlConfig: SQLFieldMappingStorageConfig = config.config as SQLFieldMappingStorageConfig;
      entityLocalStorage = new SQLFieldMappingStorage(sqlConfig.tableName, sqlConfig.idFieldName,
        sqlConfig.dbImplementation || synchronizer.globalDBImplementation, sqlConfig.mappings)
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
export function buildEntityDefs(entityDefConfigs: EntityDefConfig[], synchronizer: Synchronizer): Map<string, EntityDef> {
  const entityDefs = new Map<string, EntityDef>();
  entityDefConfigs.forEach(e => {
    const entityDef = new EntityDef();
    if (e.authorization) {
      entityDef.authHandler = buildAuthHandler(e.authorization)
    } else {
      entityDef.authHandler = synchronizer.authHandler
    }
    entityDef.fetcher = buildFetcher(e.fetcher, synchronizer);
    entityDef.localStorage = buildEntityLocalStorage(e.localStorage, synchronizer);
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
  synchronizer.fetchRevisionHandlers = buildFetchRevisionHandlers(config.revisionHandlers, synchronizer);
  const entityDefs = buildEntityDefs(config.entityDefs, synchronizer);
  synchronizer.entityDefs = entityDefs;
  return synchronizer;
}
