import { EntityDef } from "../../core/EntityDef";
import { EntityFetchCallback } from "../../fetcher/AbstractEntityFetcher";
import { HTTPResponseProcessor } from "../../fetcher/HTTPResponseProcessor";
import { HTTPRequest } from "../../request/HTTPRequest";
import { DBImplementation } from "../../storage/DBImplementation";

export class MockDBImplementation implements DBImplementation {
  async executeSQL(query: string, params: unknown[]): Promise<any> {
    console.log("EXEC", query, params)
  }

}

export type ReadEntitiesCallback = ((entityDef: EntityDef, req: HTTPRequest) => void) | undefined
export class MockResponseProcessor extends HTTPResponseProcessor {
  readEntitiesCallback: ReadEntitiesCallback;
  constructor(readEntitiesCallback?: ReadEntitiesCallback) {
    super();
    this.readEntitiesCallback = readEntitiesCallback;
  }
  async readEntities(callback: EntityFetchCallback, entityDef: EntityDef, originalRequest: HTTPRequest): Promise<void> {
    if (this.readEntitiesCallback) {
      this.readEntitiesCallback(entityDef, originalRequest)
    }
    callback(entityDef, { name: 'mock Entity', id: 1 })
  }

}