import { EntityDef } from "./EntityDef";
import { EntitySyncResults } from "./EntitySyncResults";
import { SyncOperation } from "./SyncOperation";

export interface EntitySyncCallback {
    onEntitySyncStarted(entityDef: EntityDef, operation: SyncOperation): void;
    onEntitySyncFinished(entityDef: EntityDef, operation: SyncOperation, results: EntitySyncResults): void;
    onPercentageUpdate(percent: number): void
}