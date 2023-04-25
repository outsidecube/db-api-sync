import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AbstractEntityFetcher, EntityFetchCallback } from "./AbstractEntityFetcher";
import { HTTPResponseProcessor } from "./HTTPResponseProcessor";

export type RESTEntityFetcherConfig = {
  uriPath: string,
  method?: string,
  additionalQueryParams?: { [key: string]: string },
  responseProcessor: string | HTTPResponseProcessor
}
export class RESTEntityFetcher implements AbstractEntityFetcher {
  uriPath = "";

  method = "GET";

  additionalQueryParams: { [key: string]: string } = {};

  responseProcessor: HTTPResponseProcessor

  constructor(uriPath: string, responseProcessor: HTTPResponseProcessor, method?: string, additionalQueryParams?: { [key: string]: string }) {
    this.uriPath = uriPath;
    this.method = method ?? "GET";
    if (additionalQueryParams) {
      this.additionalQueryParams = additionalQueryParams
    }
    this.responseProcessor = responseProcessor;
  }

  public async retrieveEntities(callback: EntityFetchCallback, entityDef: EntityDef): Promise<void> {
    const req: HTTPRequest = await this.createRequest(entityDef);
    return this.responseProcessor.readEntities(callback, entityDef, req);
  }

  async createRequest(entityDef: EntityDef): Promise<HTTPRequest> {
    const req = new HTTPRequest(`${entityDef.config?.baseURI}${this.uriPath}`)
    req.setMethod(this.method);
    await entityDef.authHandler?.configureRequest(entityDef, req);
    await entityDef.fetchRevisionHandler?.configureRequest(entityDef, req);
    for (const key in this.additionalQueryParams) {
      if (Object.prototype.hasOwnProperty.call(this.additionalQueryParams, key) ) {
        req.setQueryParams(key, this.additionalQueryParams[key])
      }
    }
    return req;
  }

}