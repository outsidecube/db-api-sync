import { EntityDef } from "../core/EntityDef";
import { SaveResult } from "../storage/EntityLocalStorage";

export abstract class LocalChangeDetector {
  abstract getChangedEntities(entityDef: EntityDef): Promise<unknown[]>

  abstract updateEntityAfterSync(rawEntity: unknown, entityDef: EntityDef): Promise<SaveResult | null>;
}
