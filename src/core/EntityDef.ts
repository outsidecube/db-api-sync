/* eslint-disable class-methods-use-this */
import { AuthHandler } from "../auth/AuthHandler";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { EntitySyncResults } from "./EntitySyncResults";
import { SynchronizerConfig } from "../config/SynchronizerConfig";
import { AbstractEntityFetcher, EntityFetchCallback } from "../fetcher/AbstractEntityFetcher";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";

export type EntityProcessor = (mapForSaving: Map<string, unknown>, rawObject: unknown) => unknown


export class EntityDef {
  config?: SynchronizerConfig;

  authHandler?: AuthHandler;

  fetchRevisionHandler?: FetchRevisionHandler;

  fetcher?: AbstractEntityFetcher;

  localStorage?: EntityLocalStorage;

  sendable?: boolean;

  fetchable?: boolean;

  deletable?: boolean;

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

  public async fetchEntities(): Promise<EntitySyncResults> {
    if (!this.fetchable) throw new Error("Trying to fetch a non-fetchable entity");
    const results: EntitySyncResults = this.buildResults();
    const cb: EntityFetchCallback = async (entityDef: EntityDef, rawEntityObject) => {
      try {
        const resp = await this.localStorage?.saveEntity(rawEntityObject)
        if (resp?.inserted) {
          results.insertedCount += 1;
        } else if (resp?.updated) {
          results.updatedCount += 1;
        }
      } catch (e) {
        results.errorCount+=1;
        results.errors.push(e as Error)
      }
    }
    await this.fetcher?.retrieveEntities(cb, this);
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