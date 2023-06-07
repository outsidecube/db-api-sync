import { EntityDef } from "../core/EntityDef";
import { SaveResult } from "../storage/EntityLocalStorage";
import { LocalChangeDetector } from "./LocalChangeDetector";

export type FieldValueChangeDetectorConfig = {
  field: string,
  value: unknown,
  valueAfterSync: unknown
}
export class FieldValueChangeDetector extends LocalChangeDetector {
 
  private field: string;

  private value: unknown;

  private valueAfterSync: unknown;

  constructor(field: string, value: unknown, valueAfterSync: unknown) {
    super();
    this.field = field;
    this.value = value;
    this.valueAfterSync = valueAfterSync;
  }

  async getChangedEntities(entityDef: EntityDef): Promise<unknown[]> {
    if (!entityDef || !entityDef.localStorage) {
      throw new Error("Invalid EntityDef: must have a localStorage configured");
    }

    const fieldMap = new Map<string, unknown>();
    let entities: unknown[] = [];
    if (Array.isArray(this.value)) {
      for (const v of this.value) {
        fieldMap.set(this.field, v);
        // eslint-disable-next-line no-await-in-loop
        entities = await entityDef.localStorage.getEntitiesByFieldMap(fieldMap);
      }
    } else {
      fieldMap.set(this.field, this.value);
      entities = await entityDef.localStorage.getEntitiesByFieldMap(fieldMap);
    }
    return entities;
  }

  async updateEntityAfterSync(rawEntity: unknown, entityDef: EntityDef): Promise<SaveResult | null> {
    if (this.valueAfterSync === undefined || this.valueAfterSync === null) return null; 
    if (!entityDef || !entityDef.localStorage) {
      throw new Error("Invalid EntityDef: must have a localStorage configured");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedEntity = {...(rawEntity as any)};
    updatedEntity[this.field] = this.valueAfterSync;
    return entityDef.localStorage.saveEntity(updatedEntity);
  }
  
}