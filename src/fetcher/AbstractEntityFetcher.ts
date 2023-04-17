import { EntityDef } from "../core/EntityDef";

export type EntityFetchCallback = (entityDef: EntityDef, rawEntityObject: unknown) => Promise<void>;

export abstract class AbstractEntityFetcher {
  abstract retrieveEntities(callback: EntityFetchCallback,
    entityDef: EntityDef): Promise<void>
}
