/**
 * Interface for classes implmenenting a Storage of an Entity, like DB, filesystem, etc
 */
export interface EntityLocalStorage {
  getHighestFieldValue(fieldName: string): unknown;

  getEntitiesByField(fieldName: string, value: unknown): unknown[];
}