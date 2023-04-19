import { EntityDef, Synchronizer, SynchronizerConfig, buildSynchronizer } from '../index';
import { EntityLocalStorage } from '../storage/EntityLocalStorage';
import { SQLFieldMappingStorage } from '../storage/SQLFieldMappingStorage';
import { MockDBImplementation } from './helper/MockDBImplementation';

describe('valid EntityDefBuilder', () => {
  let synchronizer: Synchronizer;

  beforeAll(() => {
    const config: SynchronizerConfig = {
      baseURI: 'https://testapi.com/api/v1',
      authorization: {
        handler: 'BearerAuthHandler',
        config: {
          token: 'token',
        },
      },
      globalDBImplementation: new MockDBImplementation(),
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
            revisionHandler: 'timestampHandler',
            config: {
              uriPath: '/users',
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
});
