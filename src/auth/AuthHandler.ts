import { HTTPRequest } from "../request/HTTPRequest";

/**
 * Interface for classes responsible of configuring a request in order to provide authentication mechanisms for it.
 */
export interface AuthHandler {
  configureRequest(req: HTTPRequest): Promise<void>;

}