/* eslint-disable class-methods-use-this */
import { AuthHandler } from "../auth/AuthHandler";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { EntitySyncResults } from "./EntitySyncResults";
import { SynchronizerConfig } from "../config/SynchronizerConfig";
import { AbstractEntityFetcher, EntityFetchCallback, EntityFetchCallbackError } from "../fetcher/AbstractEntityFetcher";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";
import { LocalChangeDetector } from "../sender/LocalChangeDetector";
import { AbstractEntitySender } from "../sender/AbstractEntitySender";
import { SyncOperation } from "./SyncOperation";

export type EntityProcessor = (mapForSaving: Map<string, unknown>, rawObject: unknown) => unknown
export type EntityFilter = (entity: EntityDef, rawObject: unknown) => Promise<boolean>
export type PercentUpdatedCallback = (value: number) => void;
export class EntityDef {
  config?: SynchronizerConfig;

  authHandler?: AuthHandler;

  fetchRevisionHandler?: FetchRevisionHandler;

  fetcher?: AbstractEntityFetcher;

  sender?: AbstractEntitySender;

  localStorage?: EntityLocalStorage;

  localChangeDetector?: LocalChangeDetector;

  sendable?: boolean;

  percentWeight?: number

  fetchable?: boolean;

  deletable?: boolean;

  fetchFilter?: EntityFilter;

  name?: string;

  private buildResults(): EntitySyncResults {
    return {
      insertedCount: 0,
      updatedCount: 0,
      errorCount: 0,
      errors: [],
      deletedCount: 0,
      sentCount: 0
    };
  }

  public async fetchEntities(onPercentUpdated?: PercentUpdatedCallback): Promise<EntitySyncResults> {
    if (!this.fetchable) throw new Error("Trying to fetch a non-fetchable entity");
    const results: EntitySyncResults = this.buildResults();
    const cb: EntityFetchCallback = async (entityDef: EntityDef, rawEntityObject) => {
      try {
        if (this.fetchFilter && !await this.fetchFilter(this, rawEntityObject)) {
          // skip entity
          return;
        }
        const resp = await this.localStorage?.saveEntity(rawEntityObject)
        if (resp?.inserted) {
          results.insertedCount += 1;
        } else if (resp?.updated) {
          results.updatedCount += 1;
        }
      } catch (e) {
        results.errorCount += 1;
        results.errors.push({
          entityDef, errorMsg: `${e}`, operation: SyncOperation.FETCH,
          exception: e as Error, rawObject: rawEntityObject
        })
      }
    }
    const errorCb: EntityFetchCallbackError = async (entityDef: EntityDef, exception: unknown, errorString: string, rawEntityObject: unknown) => {
      
      results.errorCount += 1;
      results.errors.push({
        entityDef, errorMsg: errorString, operation: SyncOperation.FETCH,
        exception: exception as Error, rawObject: rawEntityObject
      })
    }
    await this.fetcher?.retrieveEntities(cb, errorCb, this, onPercentUpdated);
    return results;
  }

  public async sendEntities(): Promise<EntitySyncResults> {
    if (!this.sendable) throw new Error("Trying to fetch a non-sendable entity");
    const results: EntitySyncResults = this.buildResults();
    results.sentCount = 0;
    try {

      const rawEntities = await this.localChangeDetector?.getChangedEntities(this);
      if (rawEntities) {
        for (const rawEntity of rawEntities) {
          try {

            // eslint-disable-next-line no-await-in-loop
            await this.sender?.sendEntity(rawEntity, this);
            results.sentCount += 1;
          } catch (e) {
            results.errorCount += 1;
            results.errors.push({
              entityDef: this, operation: SyncOperation.SEND, errorMsg: `${e}`,
              exception: e instanceof Error ? e as Error : new Error(`${e}`), rawObject: rawEntity
            })
          }
        }

      }
      return results;
    } catch (e) {
      console.log("error getting entities for sync", e)
      throw e;
    }
  }

  public async deleteEntities(): Promise<EntitySyncResults> {
    if (!this.deletable) throw new Error("Trying to delete a non-deletable entity");
    const results: EntitySyncResults = this.buildResults();
    results.deletedCount = 0;
    return results;
  }
}