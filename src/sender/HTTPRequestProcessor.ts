import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";

export abstract class HTTPRequestProcessor {
  abstract sendEntity(entityDef: EntityDef, rawEntity: unknown,
    originalRequest: HTTPRequest, onPercentUpdated?: PercentUpdatedCallback): Promise<void>
}