import { EntityDef } from "../core/EntityDef";

// only support for single id
export type EntityId = string;
export type EntityDeletionCallback = (entityDef: EntityDef, id: EntityId) => Promise<void>;
export type EntityDeletionCallbackError = (entityDef: EntityDef, exception: unknown, errorString: string) => Promise<void>;

export abstract class AbstractDeletionDetector {
  abstract detectEntitiesToDelete(callback: EntityDeletionCallback,
    errorCallback: EntityDeletionCallbackError, entityDef: EntityDef): Promise<void>
}