import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { AbstractEntitySender } from "./AbstractEntitySender";
import { HTTPRequestProcessor } from "./HTTPRequestProcessor";

export type RESTEntitySenderConfig = {
  uriPath: string,
  method?: string,
  additionalQueryParams?: { [key: string]: string },
  requestProcessor: HTTPRequestProcessor
}
export class RESTEntitySender implements AbstractEntitySender {
  uriPath = "";

  method = "POST";

  additionalQueryParams: { [key: string]: string } = {};

  requestProcessor: HTTPRequestProcessor

  constructor(uriPath: string, requestProcessor: HTTPRequestProcessor, method?: string, additionalQueryParams?: { [key: string]: string }) {
    this.uriPath = uriPath;
    this.method = method ?? "GET";
    if (additionalQueryParams) {
      this.additionalQueryParams = additionalQueryParams
    }
    this.requestProcessor = requestProcessor;
  }

  async sendEntity(rawEntity: unknown, entityDef: EntityDef, onPercentUpdated?: PercentUpdatedCallback): Promise<void> {
    const req: HTTPRequest = await this.createRequest(entityDef);
    await this.requestProcessor.sendEntity(entityDef, rawEntity, req, onPercentUpdated);
  }

  async createRequest(entityDef: EntityDef): Promise<HTTPRequest> {
    const req = new HTTPRequest(`${entityDef.config?.baseURI}${this.uriPath}`)
    req.setMethod(this.method);
    await entityDef.authHandler?.configureRequest(entityDef, req);
    await entityDef.fetchRevisionHandler?.configureRequest(entityDef, req);
    for (const key in this.additionalQueryParams) {
      if (Object.prototype.hasOwnProperty.call(this.additionalQueryParams, key)) {
        req.setQueryParams(key, this.additionalQueryParams[key])
      }
    }
    return req;
  }

}