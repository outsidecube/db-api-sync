import { EntityDef } from "../core/EntityDef";

export abstract class AbstractEntitySender  {
  
  abstract sendEntity(rawEntity:unknown, entityDef: EntityDef): Promise<unknown>;
}