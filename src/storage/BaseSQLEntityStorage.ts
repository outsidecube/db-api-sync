import { DBImplementation } from "./DBImplementation";
import { EntityLocalStorage, SaveResult } from "./EntityLocalStorage";

export type BaseSQLEntityStorageConfig = {
  tableName: string;
  idFieldName: string | [];
  dbImplementation: DBImplementation
}
export abstract class BaseSQLEntityStorage implements EntityLocalStorage {
  tableName: string;

  idFieldName: string | []

  dbImplementation: DBImplementation

  constructor(tableName: string, idFieldName: string | [], dbImplementation: DBImplementation) {
    this.tableName = tableName;
    this.idFieldName = idFieldName;
    this.dbImplementation = dbImplementation;
  }

  async getHighestFieldValue(fieldName: string): Promise<unknown> {
    const query = `SELECT MAX(${fieldName}) as MVALUE FROM ${this.tableName}`
    const resp = await this.dbImplementation.executeSQL(query, []);
    if (resp.rows.length === 0) {
      return null;
    }
    return resp.rows.item(0).MVALUE;

  }

  abstract getEntitiesByFieldMap(fieldValues: Map<string, unknown>): Promise<unknown[]>;

  abstract saveEntity(rawEntityObject: unknown): Promise<SaveResult>;
}