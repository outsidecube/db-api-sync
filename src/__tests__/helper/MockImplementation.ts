import { EntityDef } from "../../core/EntityDef";
import { EntityFetchCallback } from "../../fetcher/AbstractEntityFetcher";
import { HTTPResponseProcessor } from "../../fetcher/HTTPResponseProcessor";
import { HTTPRequest } from "../../request/HTTPRequest";
import { DBImplementation } from "../../storage/DBImplementation";

export class MockDBImplementation implements DBImplementation {
  async executeSQL(query: string, params: unknown[]): Promise<any> {
    console.log("EXEC", query,params)
  }

}

export class MockResponseProcessor extends HTTPResponseProcessor {
  async readEntities(callback: EntityFetchCallback, entityDef: EntityDef, originalRequest: HTTPRequest): Promise<void> {
    callback(entityDef, {name: 'mock Entity', id: 1}) 
  }

}