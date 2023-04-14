<p align="center">
 <img width="100px" src="https://raw.githubusercontent.com/outsidecube/db-api-sync/master/.github/images/favicon512x512-npm.png" align="center" alt=":package: ts-npm-package-boilerplate" />
 <h2 align="center">DB API Sync</h2>
 <p align="center"></p>
  <p align="center">
    <a href="https://github.com/outsidecube/db-api-sync/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/outsidecube/db-api-sync?style=flat&color=336791" />
    </a>
    <a href="https://github.com/outsidecube/db-api-sync/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/outsidecube/db-api-sync?style=flat&color=336791" />
    </a>
     <a href="https://github.com/outsidecube/db-api-sync">
      <img alt="GitHub Downloads" src="https://img.shields.io/npm/dw/db-api-sync?style=flat&color=336791" />
    </a>
    <a href="https://github.com/outsidecube/db-api-sync">
      <img alt="GitHub Total Downloads" src="https://img.shields.io/npm/dt/db-api-sync?color=336791&label=Total%20downloads" />
    </a>
 <a href="https://github.com/outsidecube/db-api-sync">
      <img alt="GitHub release" src="https://img.shields.io/github/release/outsidecube/db-api-sync.svg?style=flat&color=336791" />
    </a>
    <br />
    <br />
  <a href="https://github.com/outsidecube/db-api-sync/issues/new/choose">Report Bug</a>
  <a href="https://github.com/outsidecube/db-api-sync/issues/new/choose">Request Feature</a>
  </p>
 
<p align="center"><strong>TypeScript / JS Database synchronization library</strong>✨</p>

# Getting started

## Installation

Install this library
```
npm install --save @outsidecube/db-api-sync
```

## Configuration
In order to configure this you will need to provide.
### 1. Processor object
Before you start using the Synchronizer, you will need to write a class that implements `HTTPResponseProcessor`, with the following signature:
`readEntities(callback: EntityFetchCallback, originalRequest: HTTPRequest): Promise<void>`

This would be a minimal example:
```ts
import {
  EntityDef,
  EntityFetchCallback,
  HTTPRequest,
  HTTPResponseProcessor,
} from '@outsidecube/db-api-sync';

export default class MyCustomProcessor implements HTTPResponseProcessor {
  async readEntities(
    callback: EntityFetchCallback,
    entityDef: EntityDef,
    originalRequest: HTTPRequest,
  ): Promise<void> {
    const r: Response = await originalRequest.fetch();
    const { data } = await r.json();
    for (const element of data) {
      await callback(entityDef, element);
    }
  }
}
```

### 2. Configuration Object
The configuration object has a structure defined in `SynchronizerConfig.ts`. It has the following elements:
```js
{
  baseURI: "[base URI for API]",
  fetchers: [
    {
      name: "default",
      default: true,
      type: "RESTEntityFetcher",
      config: {
        //here comes the custom procesor defined
        "responseProcessor": new MyCustomProcessor(); 
      }
    }
  ]
}
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](issues).
The starting point for contributing is understanding the class design:
<img width="100px" src="https://raw.githubusercontent.com/outsidecube/db-api-sync/master/docs/db-api-sync.png" align="center" alt=":package: ts-npm-package-boilerplate" />

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [Outside The Cube](https://github.com/outsidecube).<br />
This project is [BSD](LICENSE) licensed.
