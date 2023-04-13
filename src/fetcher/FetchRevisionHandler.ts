import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";

export interface FetchRevisionHandler {
  configureRequest(entity: EntityDef, req: HTTPRequest): Promise<void>;
}