import { EntityDef, PercentUpdatedCallback } from "../core/EntityDef";

export abstract class AbstractEntitySender  {
  
  abstract sendEntity(rawEntity:unknown, entityDef: EntityDef, onPercentUpdated?: PercentUpdatedCallback): Promise<unknown>;
}