import { DBImplementation } from "./DBImplementation";
import { EntityLocalStorage, SaveResult } from "./EntityLocalStorage";

export type BaseSQLEntityStorageConfig= {
  tableName: string;
  idFieldName: string;
  dbImplementation: DBImplementation
}
export abstract class BaseSQLEntityStorage implements EntityLocalStorage {
  tableName: string;

  idFieldName: string

  dbImplementation: DBImplementation

  constructor(tableName: string, idFieldName: string, dbImplementation: DBImplementation) {
    this.tableName = tableName;
    this.idFieldName = idFieldName;
    this.dbImplementation = dbImplementation;
  }

  async getHighestFieldValue(fieldName: string): Promise<unknown> {
    const query = `SELECT MAX(?) FROM ${this.tableName}`
    return this.dbImplementation.executeSQL(query, [fieldName])
  }
  
  abstract getEntitiesByField(fieldName: string, value: unknown): Promise<unknown[]>;

  abstract saveEntity(rawEntityObject: unknown): Promise<SaveResult>;
}