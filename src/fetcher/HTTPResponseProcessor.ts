import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { EntityFetchCallback } from "./AbstractEntityFetcher";

export abstract class HTTPResponseProcessor {
  abstract readEntities(callback: EntityFetchCallback, entityDef: EntityDef, originalRequest: HTTPRequest, onPercentUpdated?: PercentUpdatedCallback): Promise<void>
}