import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { EntityFetchCallback } from "./AbstractEntityFetcher";

export interface HTTPResponseProcessor {
  readEntities(callback: EntityFetchCallback, entityDef: EntityDef, originalRequest: HTTPRequest): Promise<void>
}