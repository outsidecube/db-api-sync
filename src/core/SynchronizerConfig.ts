import { AbstractEntityFetcher } from "../fetcher/AbstractEntityFetcher"

type EntityDefConfig = {
  fetcher?: string
}
type FetcherDef = {
  name: string,
  default?: boolean,
  type: "RESTEntityFetcher" | AbstractEntityFetcher,
  config: unknown
}

export type SynchronizerConfig = {
  baseURI: string,
  fetchers: Array<FetcherDef>
  entityDefs: Array<EntityDefConfig>
}