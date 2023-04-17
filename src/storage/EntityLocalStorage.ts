/**
 * Interface for classes implmenenting a Storage of an Entity, like DB, filesystem, etc
 */
export interface EntityLocalStorage {
  getHighestFieldValue(fieldName: string): Promise<unknown>;

  getEntitiesByField(fieldName: string, value: unknown): Promise<unknown[]>;

  saveEntity(rawEntityObject: unknown): Promise<void>
}
