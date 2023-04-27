import { BaseSQLEntityStorage, BaseSQLEntityStorageConfig } from "./BaseSQLEntityStorage";
import { DBImplementation } from "./DBImplementation";
import { SaveResult } from "./EntityLocalStorage";

export type FieldMapping = { [key: string]: string | ((row: unknown) => unknown) }
export type EntityProcessor = (mapForSaving: Map<string, unknown>, rawObject: unknown) => unknown
export type SQLFieldMappingStorageConfig = BaseSQLEntityStorageConfig & {
  mappings: FieldMapping,
  preProcessor?: EntityProcessor
}

export class SQLFieldMappingStorage extends BaseSQLEntityStorage {
  mappings?: FieldMapping;

  preProcessor?: EntityProcessor

  constructor(tableName: string, idFieldName: string, dbImplementation: DBImplementation, mappings: FieldMapping, preProcessor?: EntityProcessor) {
    super(tableName, idFieldName, dbImplementation);
    this.mappings = mappings;
    this.preProcessor = preProcessor;
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
      throw new Error(`Cannot determine id for object ${JSON.stringify(rawEntityObject)}. Trying to access ${this.idFieldName} mapped object`);
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

  protected buildObjectMap(rawEntityObject: unknown, excludeId?:boolean) {
    const map = new Map<string, unknown>();
    for (const column in this.mappings) {
      if (Object.prototype.hasOwnProperty.call(this.mappings, column)) {
        if (!excludeId || (column !== this.idFieldName)) {
          map.set(column, this.getValueForColumn(column, rawEntityObject));
        }
      }
    }
    return map;
  }

  updateEntity(id: unknown, rawEntityObject: unknown) {

    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];
    const objectMap = this.buildObjectMap(rawEntityObject, true);
    if (this.preProcessor) {
      this.preProcessor(objectMap, rawEntityObject);
    }
    objectMap.forEach((value, key) => {
      queryColumns.push(`${key} = ?`);
      queryValues.push(value);
    })


    const columnNames = queryColumns.join(", ");

    queryValues.push(id)
    // Construct the SQL insert query
    const query = `UPDATE ${this.tableName} SET ${columnNames} WHERE ${this.idFieldName} = ?;`;

    return this.dbImplementation.executeSQL(query, queryValues);
  }

  insertEntity(rawEntityObject: unknown) {
    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];
    const objectMap = this.buildObjectMap(rawEntityObject);
    if (this.preProcessor) {
      this.preProcessor(objectMap, rawEntityObject);
    }
    objectMap.forEach((value, key) => {
      queryColumns.push(key);
      queryValues.push(value);
    })
    

    const columnNames = queryColumns.join(", ");
    const placeholders = queryValues.map(() => `?`).join(", ");

    // Construct the SQL insert query
    const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders});`;

    return this.dbImplementation.executeSQL(query, queryValues);
  }


}

