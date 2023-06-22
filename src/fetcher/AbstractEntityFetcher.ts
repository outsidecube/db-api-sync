import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";

export type EntityFetchCallback = (entityDef: EntityDef, rawEntityObject: unknown) => Promise<void>;
export type EntityFetchCallbackError = (entityDef: EntityDef, exception: unknown, errorString: string, rawEntityObject?: unknown) => Promise<void>;

export abstract class AbstractEntityFetcher {
  abstract retrieveEntities(callback: EntityFetchCallback, errorCallback: EntityFetchCallbackError,
    entityDef: EntityDef, onPercentUpdated?: PercentUpdatedCallback): Promise<void>
}
