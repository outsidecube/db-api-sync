import { BearerAuthHandlerConfig } from '../auth/BearerAuthHandler';
import { EntityDef, HTTPRequest, Synchronizer, SynchronizerConfig, buildSynchronizer } from '../index';
import { EntityLocalStorage } from '../storage/EntityLocalStorage';
import { SQLFieldMappingStorage } from '../storage/SQLFieldMappingStorage';
import { MockDBImplementation, MockResponseProcessor, ReadEntitiesCallback } from './helper/MockImplementation';
import { expect, jest, test } from '@jest/globals';
describe('valid EntityDefBuilder', () => {
  let synchronizer: Synchronizer;
  let config: SynchronizerConfig;
  beforeAll(() => {
    config = {
      baseURI: 'https://testapi.com/api/v1',
      authorization: {
        handler: 'BearerAuthHandler',
        config: {
          token: 'token',
        },
      },
      globalDBImplementation: new MockDBImplementation(),
      httpResponseProcessors: [{
        name: 'mockResponseProcessor',
        httpResponseProcessor: new MockResponseProcessor()
      }],
      revisionHandlers: [
        {
          name: 'timestampHandler',
          revisionHandler: 'TimestampFieldRevisionHandler',
          config: {
            timestampFieldName: 'Timestamp',
            timestampParameterName: 'timestamp',
          },
        },
      ],
      entityDefs: [
        {
          name: 'User',
          fetchable: true,
          revisionHandler: 'timestampHandler',
          localStorage: {
            entityLocalStorage: 'SQLFieldMapping',
            config: {
              tablename: 'User',
              idFieldName: 'id',
              mappings: {
                Id: 'id',
                FirstName: 'firstName',
                LastName: 'lastName',
                Email: 'email'
              },
            },
          },
          fetcher: {
            fetcher: 'RESTEntityFetcher',
            config: {
              uriPath: '/users',
              responseProcessor: 'mockResponseProcessor'
            },
          },
        },
      ],
    };
    synchronizer = buildSynchronizer(config);
  });

  test('should have the right localstorage type', () => {
    const ef: EntityDef = synchronizer.entityDefs.values().next().value;
    expect(ef.localStorage instanceof EntityLocalStorage);
    expect(ef.localStorage instanceof SQLFieldMappingStorage);
  });

  test('should have the right table within localstorage', () => {
    const ef: EntityDef = synchronizer.entityDefs.values().next().value;
    const ls: SQLFieldMappingStorage = ef.localStorage as SQLFieldMappingStorage;
    expect(ls.tableName === 'Users')
  });
  test('should have the right id column within localstorage', () => {
    const ef: EntityDef = synchronizer.entityDefs.values().next().value;
    const ls: SQLFieldMappingStorage = ef.localStorage as SQLFieldMappingStorage;
    expect(ls.idFieldName === 'id')
  });
  test('should correctly process the auth token', async () => {
    (config.authorization.config as BearerAuthHandlerConfig).token = async () => {
      return new Promise<string>(function (resolve) {
        debugger;
        setTimeout(() => resolve('abc'), 300);
      });
    }
    const myCallback = jest.fn((ef: EntityDef, req: HTTPRequest) => null);
    config.httpResponseProcessors = [{
      name: 'mockResponseProcessor',
      httpResponseProcessor: new MockResponseProcessor(myCallback)
    }],
      synchronizer = buildSynchronizer(config);
    await synchronizer.fetchAll();
    expect(myCallback).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      getHeader: expect.any(Function)
    }));
    expect(myCallback.mock.calls[0][1].getHeader('Authorization')).toBe('Bearer abc');
  });
});
