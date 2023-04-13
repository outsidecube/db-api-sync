/**
 * Type representing a synchronization result over a specific entity
 */
export type EntitySyncResults = {

  /**
   * Number of inserted entities in local Storage
   */
  insertedCount?: number,
  /**
   * Number of entities that had an error during insert / update / delete
   */
  errorCount?: number,
  /**
   * Number of updated entities
   */
  updatedCount?: number,
  /**
   * Number of deleted entities
   */
  deletedCount?: number,
  /**
   * Number of sent entities
   */
  sentCount?: number,
  /**
   * Array of Errors happened during processing
   */
  errors?: Error[]
}