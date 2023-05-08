import { BaseSQLEntityStorage, BaseSQLEntityStorageConfig } from "./BaseSQLEntityStorage";
import { DBImplementation } from "./DBImplementation";
import { SaveResult } from "./EntityLocalStorage";

export type FieldMapping = { [key: string]: string | ((row: unknown) => unknown) }
export type EntityProcessor = (mapForSaving: Map<string, unknown>, rawObject: unknown, db?: DBImplementation) => Promise<unknown>
export type SQLFieldMappingStorageConfig = BaseSQLEntityStorageConfig & {
  mappings: FieldMapping,
  preProcessor?: EntityProcessor,
  postProcessor?: EntityProcessor
}

export class SQLFieldMappingStorage extends BaseSQLEntityStorage {
  
  mappings?: FieldMapping;

  preProcessor?: EntityProcessor

  postProcessor?: EntityProcessor

  constructor(tableName: string, idFieldName: string | [], dbImplementation: DBImplementation, mappings: FieldMapping, preProcessor?: EntityProcessor, postProcessor?: EntityProcessor) {
    super(tableName, idFieldName, dbImplementation);
    this.mappings = mappings;
    this.preProcessor = preProcessor;
    this.postProcessor = postProcessor;
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

    const idFields = typeof this.idFieldName === 'string' ? [this.idFieldName] : this.idFieldName;
    const idMap = new Map<string, unknown>();
    for (const idField of idFields) {
      const value = this.getValueForColumn(idField, rawEntityObject);
      if (!value) {
        throw new Error(`Cannot determine id for object ${JSON.stringify(rawEntityObject)}. Trying to access ${idField} mapped object`);
      }
      idMap.set(idField, value);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing: any = await this.getEntitiesByFieldMap(idMap);
    if (existing && existing.rows.length) {
      await this.updateEntity(idMap, rawEntityObject);
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

  public async getEntitiesByFieldMap(fieldValues: Map<string, unknown>): Promise<unknown[]> {

    let query = `select * from ${this.tableName}`;
    const params = []
    if (fieldValues.size) {
      query += ' where '
      let i = 0;
      for (const key of fieldValues.keys()) {
        if (i > 0) query += ' and '
        query += `${key} = ?`;
        params.push(fieldValues.get(key))
        i += 1;
      }
    }
    return this.dbImplementation.executeSQL(query, params);
  }


  protected buildObjectMap(rawEntityObject: unknown, excludeId?: boolean) {
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

  async updateEntity(idFields: Map<string, unknown>, rawEntityObject: unknown) {

    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];
    const objectMap = this.buildObjectMap(rawEntityObject, true);
    if (this.preProcessor) {
      await this.preProcessor(objectMap, rawEntityObject, this.dbImplementation);
    }
    objectMap.forEach((value, key) => {
      queryColumns.push(`${key} = ?`);
      queryValues.push(value);
    })


    const columnNames = queryColumns.join(", ");

    let whereStr = '';
    let i = 0;
    for (const key of idFields.keys()) {
      if (i > 0) whereStr += ' and '
      whereStr += `${key} = ?`;
      queryValues.push(idFields.get(key))
      i += 1;
    }
    // Construct the SQL insert query
    const query = `UPDATE ${this.tableName} SET ${columnNames} WHERE ${whereStr};`;

    await this.dbImplementation.executeSQL(query, queryValues);
    if (this.postProcessor) {
      await this.postProcessor(objectMap, rawEntityObject, this.dbImplementation);
    }
  }

  async insertEntity(rawEntityObject: unknown) {
    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];
    const objectMap = this.buildObjectMap(rawEntityObject);
    if (this.preProcessor) {
      await this.preProcessor(objectMap, rawEntityObject, this.dbImplementation);
    }
    objectMap.forEach((value, key) => {
      queryColumns.push(key);
      queryValues.push(value);
    })


    const columnNames = queryColumns.join(", ");
    const placeholders = queryValues.map(() => `?`).join(", ");

    // Construct the SQL insert query
    const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders});`;

    await this.dbImplementation.executeSQL(query, queryValues);
    if (this.postProcessor) {
      await this.postProcessor(objectMap, rawEntityObject, this.dbImplementation);
    }
  }


}

