import axios, { AxiosRequestConfig } from 'axios';

export type HTTPResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  status?: number,
  statusText?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any
};
/**
 * class that represents a request to an HTTP service. The base implementation is built around standard `axios` API
 */
export class HTTPRequest {
  private config: AxiosRequestConfig = {};

  constructor(url: string) {
    this.config.url = url
  }

  public get url(): string | undefined {
    return this.config.url;
  }

  public set url(s: string | undefined) {
    this.config.url = s;
  }

  public clone(): HTTPRequest {
    const copy = new HTTPRequest(this.config.url || "");
    copy.config = { ...this.config };
    return copy;
  }

  public setHeader(name: string, value: string): void {
    if (!this.config.headers) {
      this.config.headers = {};
    }
    this.config.headers[name] = value;
  }

  public getHeader(name: string): string | undefined {
    return this.config.headers?.[name];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setBody(body: any): void {
    this.config.data = body;
  }

  public setMethod(method: string): void {
    this.config.method = method;
  }

  public setQueryParams(name: string, value: string): void {
    if (!this.config.params) {
      this.config.params = {};
    }
    this.config.params[name] = value;
  }

  public async fetch(): Promise<HTTPResponse> {
    try {
      const response = await axios(this.config);
      return response;
    } catch (e) {
      throw new Error(`Error while executing fetch to ${this.config}.`);
    }
  }
}
