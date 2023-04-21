import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AuthHandler } from "./AuthHandler";

export type BearerAuthHandlerConfig = {
  token: string
}
export class BearerAuthHandler implements AuthHandler {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async configureRequest(entityDef: EntityDef, req: HTTPRequest): Promise<void> {
    req.setHeader("Authorization", `Bearer ${this.token}`)
    req.setHeader("Content-Type", "application/json")
  }
  
}