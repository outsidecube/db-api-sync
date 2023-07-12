import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AbstractDeletionDetector, EntityDeletionCallback, EntityDeletionCallbackError } from "./AbstractDeletionDetector";
import { HTTPDeletionResponseProcessor } from "./HTTPDeletionResponseProcessor";

export type RESTEntityDeletionConfig = {
  uriPath: string,
  method?: string,
  additionalQueryParams?: { [key: string]: string },
  responseProcessor: string | HTTPDeletionResponseProcessor
}
export class RESTEntityDeletionDetector extends AbstractDeletionDetector {
  uriPath = "";

  method = "GET";

  additionalQueryParams: { [key: string]: string } = {};

  responseProcessor: HTTPDeletionResponseProcessor

  constructor(uriPath: string, responseProcessor: HTTPDeletionResponseProcessor,
    method?: string, additionalQueryParams?: { [key: string]: string }) {
    super();
    this.uriPath = uriPath;
    this.method = method ?? "GET";
    if (additionalQueryParams) {
      this.additionalQueryParams = additionalQueryParams
    }
    this.responseProcessor = responseProcessor;

  }

  public async detectEntitiesToDelete(callback: EntityDeletionCallback, errorCallback: EntityDeletionCallbackError, 
    entityDef: EntityDef): Promise<void> {
    const req: HTTPRequest = await this.createRequest(entityDef);
    return this.responseProcessor.readEntities(callback, errorCallback, entityDef, req);
  }

  async createRequest(entityDef: EntityDef): Promise<HTTPRequest> {
    const req = new HTTPRequest(`${entityDef.config?.baseURI}${this.uriPath}`)
    req.setMethod(this.method);
    await entityDef.authHandler?.configureRequest(entityDef, req);
    await entityDef.deleteRevisionHandler?.configureRequest(entityDef, req);
    for (const key in this.additionalQueryParams) {
      if (Object.prototype.hasOwnProperty.call(this.additionalQueryParams, key)) {
        req.setQueryParams(key, this.additionalQueryParams[key])
      }
    }
    return req;
  }

}