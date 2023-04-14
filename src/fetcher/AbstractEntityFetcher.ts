import { EntityDef } from "../core/EntityDef";

export type EntityFetchCallback = (entityDef: EntityDef, rawEntityObject: unknown) => Promise<void>;

export interface AbstractEntityFetcher {
  retrieveEntities(callback: EntityFetchCallback,
    entityDef: EntityDef): Promise<void>
}
