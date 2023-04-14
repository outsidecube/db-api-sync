import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AbstractEntityFetcher, EntityFetchCallback } from "./AbstractEntityFetcher";

export class RESTEntityFetcher implements AbstractEntityFetcher {
  private uriPath = "";

  private method = "GET";

  private additionalQueryParams: { [key: string]: string } = {};

  constructor(uriPath: string) {
    this.uriPath = uriPath;
  }

  public async retrieveEntities(callback: EntityFetchCallback, entityDef: EntityDef): Promise<void> {
    const req: HTTPRequest = this.createRequest(entityDef);
    
  }

  createRequest(entityDef: EntityDef): HTTPRequest {
    const req = new HTTPRequest(`${entityDef.config?.baseURI}${this.uriPath}`)
    req.setMethod(this.method);
    entityDef.authHandler?.configureRequest(entityDef, req);
    entityDef.fetchRevisionHandler?.configureRequest(entityDef, req);
    return req;
  }

}