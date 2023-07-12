import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { EntityDeletionCallback, EntityDeletionCallbackError } from "./AbstractDeletionDetector";

export abstract class HTTPDeletionResponseProcessor {
  abstract readEntities(callback: EntityDeletionCallback, errorCallback: EntityDeletionCallbackError,
    entityDef: EntityDef,    originalRequest: HTTPRequest): Promise<void>
}