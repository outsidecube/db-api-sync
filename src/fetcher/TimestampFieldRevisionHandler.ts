import { Formatter } from "../config/SynchronizerConfig";
import { EntityDef } from "../core/EntityDef";
import { HTTPRequest } from "../request/HTTPRequest";
import { FetchRevisionHandler } from "./FetchRevisionHandler";

export type TimestampFieldRevisionHandlerConfig = {
  timestampFieldName: string,
  timestampParameterName: string,
  parameterFormatter?: string | Formatter
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

  parameterFormatter?: Formatter;

  constructor(timestampFieldName: string, timestampParameterName: string, parameterFormatter?: Formatter) {
    super()
    this.timestampFieldName = timestampFieldName;
    this.timestampParameterName = timestampParameterName;
    this.parameterFormatter = parameterFormatter
  }

  async configureRequest(entity: EntityDef, req: HTTPRequest): Promise<void> {
    if (!entity.localStorage) throw new Error(`Cannot retrieve timestamp without localStorage defined for entity ${entity}`);
    const value: unknown = await entity.localStorage.getHighestFieldValue(this.timestampFieldName);
    const paramValue = this.parameterFormatter ? this.parameterFormatter(value): value;
    req.setQueryParams(this.timestampParameterName, paramValue as string);
  }

}