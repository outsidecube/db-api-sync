import { EntityDef } from "./EntityDef";
import { EntitySyncCallback } from "./EntitySyncCallback";
import { SynchronizerConfig } from "./SynchronizerConfig";
import { SyncOperation } from "./SyncOperation";

/**
 * Main class of db-api-sync. This class is able to dispatch the processing:
 * 
 */
export class Synchronizer {
  config: SynchronizerConfig;

  private entityDefs: EntityDef[];

  constructor(config: SynchronizerConfig, entityDefs: EntityDef[]) {
    this.config = config;
    this.entityDefs = entityDefs;
    this.entityDefs.forEach(e => { e.config = config })
  }

  public async fetchAll(callback: EntitySyncCallback) {
    const totalCount = this.entityDefs.length;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const entity of this.entityDefs) {
      callback?.onEntitySyncStarted(entity, SyncOperation.FETCH);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.fetchEntities()
      callback?.onEntitySyncFinished(entity, SyncOperation.FETCH, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }

  public async sendAll(callback: EntitySyncCallback) {
    const totalCount = this.entityDefs.length;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const entity of this.entityDefs) {

      callback?.onEntitySyncStarted(entity, SyncOperation.SEND);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.sendEntities()
      callback?.onEntitySyncFinished(entity, SyncOperation.SEND, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }

  public async deleteAll(callback: EntitySyncCallback) {
    const totalCount = this.entityDefs.length;
    callback?.onPercentageUpdate(0);
    let c = 0;
    for (const entity of this.entityDefs) {
      callback?.onEntitySyncStarted(entity, SyncOperation.DELETE);
      // eslint-disable-next-line no-await-in-loop
      const results = await entity.deleteEntities();
      callback?.onEntitySyncFinished(entity, SyncOperation.DELETE, results);
      c += 1;
      callback?.onPercentageUpdate(c * 100 / totalCount);
    }
  }
}