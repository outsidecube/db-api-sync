/* eslint-disable class-methods-use-this */
import { AuthHandler } from "../auth/AuthHandler";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { EntitySyncResults } from "./EntitySyncResults";
import { SynchronizerConfig } from "../config/SynchronizerConfig";
import { AbstractEntityFetcher, EntityFetchCallback } from "../fetcher/AbstractEntityFetcher";
import { EntityLocalStorage } from "../storage/EntityLocalStorage";


export class EntityDef {
  config?: SynchronizerConfig;

  authHandler?: AuthHandler;

  fetchRevisionHandler?: FetchRevisionHandler;

  fetcher?: AbstractEntityFetcher;

  localStorage?: EntityLocalStorage;
  
  public fetchEntities(): EntitySyncResults {
    const results: EntitySyncResults = {
    };
    const cb: EntityFetchCallback = async (entityDef: EntityDef, rawEntityObject) => {
      console.log("received", rawEntityObject)
      return this.localStorage?.saveEntity(rawEntityObject)
    }
    this.fetcher?.retrieveEntities(cb, this);
    results.insertedCount = 0;
    return results;
  }

  public sendEntities(): EntitySyncResults {
    const results: EntitySyncResults = {
    };
    results.sentCount = 0;
    return results;
  }

  public deleteEntities(): EntitySyncResults {
    const results: EntitySyncResults = {
    };
    results.deletedCount = 0;
    return results;
  }
}