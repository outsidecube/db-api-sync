import { DBImplementation } from "../../storage/DBImplementation";

export class MockDBImplementation implements DBImplementation {
  async executeSQL(query: string, params: unknown[]): Promise<any> {
    console.log("EXEC", query,params)
  }

}