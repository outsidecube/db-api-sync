import { AuthHandler } from "../auth/AuthHandler";
import { Formatter, SynchronizerConfig } from "../config/SynchronizerConfig";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { HTTPResponseProcessor } from "../fetcher/HTTPResponseProcessor";
import { DBImplementation } from "../storage/DBImplementation";
import { EntityDef } from "./EntityDef";
import { EntitySyncCallback } from "./EntitySyncCallback";
import { SyncOperation } from "./SyncOperation";

/**
 * Main class of db-api-sync. This class is able to dispatch the processing:
 * 
 */
export class Synchronizer {
  config: SynchronizerConfig;

  entityDefs: Map<string, EntityDef>;

  authHandler?: AuthHandler

  globalDBImplementation?: DBImplementation;

  fetchRevisionHandlers: Map<string, FetchRevisionHandler>;

  formatters: Map<string, Formatter>;

  httpResponseProcessors: Map<string, HTTPResponseProcessor>;

  constructor(config: SynchronizerConfig) {
    this.config = config;
    this.entityDefs = new Map<string, EntityDef>();
    this.fetchRevisionHandlers = new Map<string, FetchRevisionHandler>();
    this.formatters = new Map<string, Formatter>();
    this.httpResponseProcessors = new Map<string, HTTPResponseProcessor>();

  }

  private filterEntityDefs(fn: (e: EntityDef) => boolean | undefined): Array<EntityDef> {
    const r: Array<EntityDef> = [];
    this.entityDefs.forEach((entityDef) => {
      if (fn(entityDef)) r.push(entityDef)
    })
    return r;
  }

  public async fetchAll(callback?: EntitySyncCallback) {
    const entities = this.filterEntityDefs(e => e.fetchable);
    const totalCount = entities?.length;
    if (!totalCount) return;
    callback?.onPercentageUpdate(0);
    const totalWeight = entities.reduce<number>((acc, e) => acc + (e.percentWeight || 1), 0);
    let accumulatedPercent = 0;
    let entityWeight: number;
    const percentUpdate = (percent: number) => {
      callback?.onPercentageUpdate(accumulatedPercent + percent * entityWeight / totalWeight);
    }
    for (const entity of entities) {
      entityWeight = entity.percentWeight || 1;
      callback?.onEntitySyncStarted(entity, SyncOperation.FETCH);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.fetchEntities(percentUpdate)
      callback?.onEntitySyncFinished(entity, SyncOperation.FETCH, results);
      accumulatedPercent += entityWeight / totalWeight * 100;
      callback?.onPercentageUpdate(accumulatedPercent);
    }
  }

  public async sendAll(callback?: EntitySyncCallback) {
    const entities = this.filterEntityDefs(e => e.sendable);
    const totalCount = entities.length;
    if (!totalCount) return;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const entity of entities) {

      callback?.onEntitySyncStarted(entity, SyncOperation.SEND);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.sendEntities()
      callback?.onEntitySyncFinished(entity, SyncOperation.SEND, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }

  public async deleteAll(callback?: EntitySyncCallback) {
    const entities = this.filterEntityDefs(e => e.deletable);
    const totalCount = entities.length;
    if (!totalCount) return;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const entity of entities) {
      callback?.onEntitySyncStarted(entity, SyncOperation.DELETE);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.deleteEntities();
      callback?.onEntitySyncFinished(entity, SyncOperation.DELETE, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }
}


