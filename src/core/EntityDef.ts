/* eslint-disable class-methods-use-this */
import { AuthHandler } from "../auth/AuthHandler";
import { FetchRevisionHandler } from "../fetcher/FetchRevisionHandler";
import { EntitySyncResults } from "./EntitySyncResults";
import { SynchronizerConfig } from "../config/SynchronizerConfig";
import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher";
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