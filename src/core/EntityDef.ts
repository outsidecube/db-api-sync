/* eslint-disable class-methods-use-this */
import { AuthHandler } from "../auth/AuthHandler";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { EntitySyncResults } from "./EntitySyncResults";
import { SynchronizerConfig } from "../config/SynchronizerConfig";
import { AbstractEntityFetcher, EntityFetchCallback } from "../fetcher/AbstractEntityFetcher";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";

export type EntityProcessor = (mapForSaving: Map<string, unknown>, rawObject: unknown) => unknown
export type EntityFilter = (entity: EntityDef, rawObject: unknown) => Promise<boolean>
export type PercentUpdatedCallback = (value: number) => void;
export class EntityDef {
  config?: SynchronizerConfig;

  authHandler?: AuthHandler;

  fetchRevisionHandler?: FetchRevisionHandler;

  fetcher?: AbstractEntityFetcher;

  localStorage?: EntityLocalStorage;

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
        results.errors.push(e as Error)
      }
    }
    await this.fetcher?.retrieveEntities(cb, this, onPercentUpdated);
    return results;
  }

  public async sendEntities(): Promise<EntitySyncResults> {
    if (!this.sendable) throw new Error("Trying to fetch a non-sendable entity");
    const results: EntitySyncResults = this.buildResults();
    results.sentCount = 0;
    return results;
  }

  public async deleteEntities(): Promise<EntitySyncResults> {
    if (!this.deletable) throw new Error("Trying to delete a non-deletable entity");
    const results: EntitySyncResults = this.buildResults();
    results.deletedCount = 0;
    return results;
  }
}