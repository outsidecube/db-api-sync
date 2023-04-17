import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AbstractEntityFetcher, EntityFetchCallback } from "./AbstractEntityFetcher";

export type RESTEntityFetcherConfig = {
  uriPath: string,
  method?: string,
  additionalQueryParams?: { [key: string]: string }
}
export class RESTEntityFetcher implements AbstractEntityFetcher {
  uriPath = "";

  method = "GET";

  additionalQueryParams: { [key: string]: string } = {};

  constructor(uriPath: string, method?: string, additionalQueryParams?: { [key: string]: string }) {
    this.uriPath = uriPath;
    this.method = method ?? "GET";
    if (additionalQueryParams) {
      this.additionalQueryParams = additionalQueryParams
    }
  }

  public async retrieveEntities(callback: EntityFetchCallback, entityDef: EntityDef): Promise<void> {
    const req: HTTPRequest = this.createRequest(entityDef);

  }

  createRequest(entityDef: EntityDef): HTTPRequest {
    const req = new HTTPRequest(`${entityDef.config?.baseURI}${this.uriPath}`)
    req.setMethod(this.method);
    entityDef.authHandler?.configureRequest(entityDef, req);
    entityDef.fetchRevisionHandler?.configureRequest(entityDef, req);
    for (const key in this.additionalQueryParams) {
      if (Object.prototype.hasOwnProperty.call(this.additionalQueryParams, key) ) {
        req.setQueryParams(key, this.additionalQueryParams[key])
      }
    }
    return req;
  }

}