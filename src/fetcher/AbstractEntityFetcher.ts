import { AuthHandler } from "../auth/AuthHandler";
import { EntityDef } from "../core/EntityDef"
import { FetchRevisionHandler } from "./FetchRevisionHandler";

export type EntityFetchCallback = (entityDef: EntityDef, rawEntityObject: unknown) => Promise<void>;

export interface AbstractEntityFetcher {
  retrieveEntities(callback: EntityFetchCallback,


    fetchRevisionHandler: FetchRevisionHandler,
    authHandler: AuthHandler): Promise<void>
}
