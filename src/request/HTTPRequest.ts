/**
 * class that represents a request to an HTTP service. The base implementation is built around standard `fetch` API
 */
export class HTTPRequest {
  private url: string;

  private headers: HeadersInit;

  private body: BodyInit | undefined;

  private method: string;

  private queryParams: URLSearchParams;

  private credentials: RequestCredentials | undefined;

  private responseType: ResponseType | undefined;

  private cache: RequestCache | undefined;

  constructor(url: string) {
    this.url = url;
    this.headers = new Headers();
    this.body = undefined;
    this.method = 'GET';
    this.queryParams = new URLSearchParams();
    this.credentials = undefined;
    this.responseType = undefined;
    this.cache = undefined;
  }

  public setHeader(name: string, value: string): void {
    (this.headers as Headers).set(name, value);
  }

  public setBody(body: BodyInit): void {
    this.body = body;
  }

  public setMethod(method: string): void {
    this.method = method;
  }

  public setQueryParams(name: string, value: string): void {
    this.queryParams.set(name, value);
  }

  public setCredentials(credentials: RequestCredentials): void {
    this.credentials = credentials;
  }

  public setResponseType(responseType: ResponseType): void {
    this.responseType = responseType;
  }

  public setCache(cache: RequestCache): void {
    this.cache = cache;
  }

  public async fetch(): Promise<Response> {

    const url = `${this.url}?${this.queryParams.toString()}`;
    const options: RequestInit & { [key: string]: unknown } = {
      headers: this.headers,
      method: this.method,
      body: this.body,
      credentials: this.credentials,
      cache: this.cache
    };
    if (this.responseType !== undefined) {
      options.responseType = this.responseType;
    }
    try {
      const response = await fetch(url, options);

      return response;
    } catch (e) {
      console.error(`Error while executing fetch to ${url}. ${options}`)
      throw e;
    }
  }
}
