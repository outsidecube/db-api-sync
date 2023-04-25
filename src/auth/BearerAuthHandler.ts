import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AuthHandler } from "./AuthHandler";

export type TokenType = () => Promise<string> | string
export type BearerAuthHandlerConfig = {
  token: TokenType
}
export class BearerAuthHandler implements AuthHandler {
  private token: TokenType;

  constructor(token: TokenType) {
    this.token = token;
  }

  async configureRequest(entityDef: EntityDef, req: HTTPRequest): Promise<void> {
    let tokenValue: string;
    if (typeof this.token === 'function') {
      tokenValue = await this.token();
    } else {
      tokenValue = this.token;
    }
    req.setHeader("Authorization", `Bearer ${tokenValue}`)
    req.setHeader("Content-Type", "application/json")
  }

}