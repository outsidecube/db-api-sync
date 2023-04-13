/* eslint-disable class-methods-use-this */
import { EntitySyncResults } from "./EntitySyncResults";


export class EntityDef {
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