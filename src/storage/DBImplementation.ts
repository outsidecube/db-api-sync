export interface DBImplementation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executeSQL(query: string, params: Array<unknown>): Promise<any>;
}