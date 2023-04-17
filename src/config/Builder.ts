import { AuthHandler } from "../auth/AuthHandler";
import { BearerAuthHandler, BearerAuthHandlerConfig } from "../auth/BearerAuthHandler";
import { EntityDef } from "../core/EntityDef";
import { Synchronizer } from "../core/Synchronizer";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher";
import { RESTEntityFetcher, RESTEntityFetcherConfig } from "../fetcher/RESTEntityFetcher";
import { AuthorizationConfig, EntityDefConfig, FetcherDef, SynchronizerConfig } from "./SynchronizerConfig";

export function buildAuthHandler(authorization: AuthorizationConfig): AuthHandler {
  if (authorization.handler === "BearerAuthHandler") {
    return new BearerAuthHandler((authorization.config as BearerAuthHandlerConfig).token);
  }
  return authorization.handler;

}
export function buildFetcher(fetcherDef: FetcherDef): AbstractEntityFetcher {
  let fetcher: AbstractEntityFetcher;
  if (typeof fetcherDef.fetcher === 'string') {
    if (fetcherDef.fetcher === "RESTEntityFetcher") {
      const config: RESTEntityFetcherConfig = fetcherDef.config as RESTEntityFetcherConfig;
      fetcher = new RESTEntityFetcher(config.uriPath, config.method, config.additionalQueryParams);
    } else {
      throw new Error(`Invalid fecther ${fetcherDef.fetcher}`);
    }
  } else if (fetcherDef.fetcher instanceof AbstractEntityFetcher) {
    fetcher = fetcherDef.fetcher;
  } else {
    throw new Error(`Invalid fecther ${fetcherDef.fetcher}`);
  }
  return fetcher;
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
    entityDef.fetcher = buildFetcher(e.fetcher);
    entityDefs.set(e.name, entityDef);
  })
  return entityDefs;
}

export function buildSynchronizer(config: SynchronizerConfig): Synchronizer {
  const synchronizer = new Synchronizer(config);
  const entityDefs = buildEntityDefs(config.entityDefs, synchronizer);
  synchronizer.entityDefs = entityDefs;
  synchronizer.authHandler = buildAuthHandler(config.authorization);
  synchronizer.generalDBImplementation = config.generalDBImplementation;
  return synchronizer;
}