import { EntityDef } from "./EntityDef"
import { SyncOperation } from "./SyncOperation"

export type SyncError = {
  errorMsg?: string,
  exception?: Error,
  entityDef?: EntityDef,
  rawObject?: unknown,
  operation?: SyncOperation
}

/**
 * Type representing a synchronization result over a specific entity
 */
export type EntitySyncResults = {

  /**
   * Number of inserted entities in local Storage
   */
  insertedCount: number,
  /**
   * Number of entities that had an error during insert / update / delete
   */
  errorCount: number,
  /**
   * Number of updated entities
   */
  updatedCount: number,
  /**
   * Number of deleted entities
   */
  deletedCount: number,
  /**
   * Number of sent entities
   */
  sentCount: number,
  /**
   * Array of Errors happened during processing
   */
  errors: SyncError[]
}