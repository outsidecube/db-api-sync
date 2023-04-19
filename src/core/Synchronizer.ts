import { AuthHandler } from "../auth/AuthHandler";
import { Formatter, SynchronizerConfig } from "../config/SynchronizerConfig";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
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

  constructor(config: SynchronizerConfig) {
    this.config = config;
    this.entityDefs = new Map<string, EntityDef>();
    this.fetchRevisionHandlers = new Map<string, FetchRevisionHandler>();
    this.formatters = new Map<string, Formatter>();
  }

  public async fetchAll(callback: EntitySyncCallback) {
    const totalCount = this.entityDefs.size;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const [, entity] of this.entityDefs) {
      console.log("receiving entity", entity)
      callback?.onEntitySyncStarted(entity, SyncOperation.FETCH);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.fetchEntities()
      callback?.onEntitySyncFinished(entity, SyncOperation.FETCH, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }

  public async sendAll(callback: EntitySyncCallback) {
    const totalCount = this.entityDefs.size;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const [, entity] of this.entityDefs) {

      callback?.onEntitySyncStarted(entity, SyncOperation.SEND);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.sendEntities()
      callback?.onEntitySyncFinished(entity, SyncOperation.SEND, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }

  public async deleteAll(callback: EntitySyncCallback) {
    const totalCount = this.entityDefs.size;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const [, entity] of this.entityDefs) {
      callback?.onEntitySyncStarted(entity, SyncOperation.DELETE);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.deleteEntities();
      callback?.onEntitySyncFinished(entity, SyncOperation.DELETE, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }
}


