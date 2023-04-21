export type SaveResult = { updated?: boolean, inserted?: boolean }
/**
 * Interface for classes implmenenting a Storage of an Entity, like DB, filesystem, etc
 */
export abstract class EntityLocalStorage {
  abstract getHighestFieldValue(fieldName: string): Promise<unknown>;

  abstract getEntitiesByField(fieldName: string, value: unknown): Promise<unknown[]>;

  abstract saveEntity(rawEntityObject: unknown): Promise<SaveResult>
}
