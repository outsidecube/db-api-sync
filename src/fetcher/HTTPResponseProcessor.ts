import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { EntityFetchCallback, EntityFetchCallbackError } from "./AbstractEntityFetcher";

export abstract class HTTPResponseProcessor {
  abstract readEntities(callback: EntityFetchCallback, errorCallback: EntityFetchCallbackError, entityDef: EntityDef,
    originalRequest: HTTPRequest, onPercentUpdated?: PercentUpdatedCallback): Promise<void>
}