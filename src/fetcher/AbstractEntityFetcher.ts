import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";

export type EntityFetchCallback = (entityDef: EntityDef, rawEntityObject: unknown) => Promise<void>;

export abstract class AbstractEntityFetcher {
  abstract retrieveEntities(callback: EntityFetchCallback,
    entityDef: EntityDef, onPercentUpdated?: PercentUpdatedCallback): Promise<void>
}
