import { BaseSQLEntityStorage, BaseSQLEntityStorageConfig } from "./BaseSQLEntityStorage";
import { DBImplementation } from "./DBImplementation";

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

  saveEntity(rawEntityObject: unknown): Promise<void> {
    const queryColumns: string[] = [];
    const queryValues: unknown[] = [];

    for (const column in this.mappings) {
      if (Object.prototype.hasOwnProperty.call(this.mappings, column)) {

        const mapping = this.mappings[column];

        // Calculate value based on the mapping
        let value: unknown;
        if (typeof mapping === "string") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value = (rawEntityObject as any)[mapping];
        } else if (typeof mapping === "function") {
          value = mapping(rawEntityObject);
        }

        queryColumns.push(column);
        queryValues.push(value);
      }
    }

    const columnNames = queryColumns.join(", ");
    const placeholders = queryValues.map(() => `?`).join(", ");

    // Construct the SQL insert query
    const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders});`;

    return this.dbImplementation.executeSQL(query, queryValues);
  }

  getEntitiesByField(fieldName: string, value: unknown): Promise<unknown[]> {
    const query = `select * from ${this.tableName} where ${fieldName}=?`;
    return this.dbImplementation.executeSQL(query, [value]);
  }

}