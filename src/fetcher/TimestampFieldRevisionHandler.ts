import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { FetchRevisionHandler } from "./FetchRevisionHandler";

export type TimestampFieldRevisionHandlerConfig = {
  timestampFieldName: string,
  timestampParameterName: string
}
/**
 * FetchRevisionHandler that uses a timestamp in the following way:
 * 1. it checks in the DB for the last timestamp available for the given entity. For this, the "timestampFieldName" parameter is used
 * 2. if no records, 0 is asumed
 * 3. it injects the parameter "timestampParameterName" in the request, in order to expect that the API only returns the timestamps greater than the given one
 */
export class TimestampFieldRevisionHandler extends FetchRevisionHandler {
  timestampFieldName: string;

  timestampParameterName: string;

  constructor(timestampFieldName: string, timestampParameterName: string) {
    super()
    this.timestampFieldName = timestampFieldName;
    this.timestampParameterName = timestampParameterName;
  }

  async configureRequest(entity: EntityDef, req: HTTPRequest): Promise<void> {
    if (!entity.localStorage) throw new Error(`Cannot retrieve timestamp without localStorage defined for entity ${  entity}`);
    const value: unknown = await entity.localStorage.getHighestFieldValue(this.timestampFieldName);
    req.setQueryParams(this.timestampParameterName, value as string);
  }
  
}