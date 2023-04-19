import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";

export abstract class FetchRevisionHandler {
  name?: string
  abstract configureRequest(entity: EntityDef, req: HTTPRequest): Promise<void>;
}