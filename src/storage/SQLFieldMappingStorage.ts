import { BaseSQLEntityStorage, BaseSQLEntityStorageConfig } from "./BaseSQLEntityStorage";
import { DBImplementation } from "./DBImplementation";
import { SaveResult } from "./EntityLocalStorage";

export type FieldMapping = { [key: string]: string | ((row: unknown) => unknown) }
export type SQLFieldMappingStorageConfig = BaseSQLEntityStorageConfig & {
  mappings: FieldMapping
}

export class SQLFieldMappingStorage extends BaseSQLEntityStorage {
  mappings?: FieldMapping;

  constructor(tableName: string, idFieldName: string, dbImplementation: DBImplementation, mappings: FieldMapping) {
    super(tableName, idFieldName, dbImplementation);
    this.mappings = mappings;
  }

  getValueForColumn(column: string, rawEntityObject: unknown) {
    const mapping = this.mappings ? this.mappings[column] : null;
    let value: unknown;
    if (typeof mapping === "string") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value = (rawEntityObject as any)[mapping];
    } else if (typeof mapping === "function") {
      value = mapping(rawEntityObject);
    }
    return value;
  }

  async saveEntity(rawEntityObject: unknown): Promise<SaveResult> {

    const idAttribute = this.getValueForColumn(this.idFieldName, rawEntityObject);
    if (!idAttribute) {
      throw new Error(`Cannot determine id for object ${rawEntityObject}. Trying to access ${this.idFieldName} mapped object`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing: any = await this.getEntitiesByField(this.idFieldName, idAttribute);
    if (existing && existing.rows.length) {
      await this.updateEntity(idAttribute, rawEntityObject);
      return {
        updated: true,
        inserted: false
      }
    } 
      await this.insertEntity(rawEntityObject);
      return {
        updated: false,
        inserted: true
      }
    

  }

  getEntitiesByField(fieldName: string, value: unknown): Promise<unknown[]> {
    const query = `select * from ${this.tableName} where ${fieldName}=?`;
    return this.dbImplementation.executeSQL(query, [value]);
  }


  updateEntity(id: unknown, rawEntityObject: unknown) {

    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];
    for (const column in this.mappings) {
      if (Object.prototype.hasOwnProperty.call(this.mappings, column)) {
        if (column !== this.idFieldName) {

          queryColumns.push(`${column} = ?`);
          queryValues.push(this.getValueForColumn(column, rawEntityObject));
        }
      }
    }

    const columnNames = queryColumns.join(", ");
    
    queryValues.push(id)
    // Construct the SQL insert query
    const query = `UPDATE ${this.tableName} SET ${columnNames} WHERE ${this.idFieldName} = ?;`;

    return this.dbImplementation.executeSQL(query, queryValues);
  }

  insertEntity(rawEntityObject: unknown) {
    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];
    for (const column in this.mappings) {
      if (Object.prototype.hasOwnProperty.call(this.mappings, column)) {

        queryColumns.push(column);
        queryValues.push(this.getValueForColumn(column, rawEntityObject));
      }
    }

    const columnNames = queryColumns.join(", ");
    const placeholders = queryValues.map(() => `?`).join(", ");

    // Construct the SQL insert query
    const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders});`;

    return this.dbImplementation.executeSQL(query, queryValues);
  }


}

