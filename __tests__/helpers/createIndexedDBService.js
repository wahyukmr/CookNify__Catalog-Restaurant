import { DATABASE } from '../../src/config/constants';
import IndexedDBService from '../../src/services/IndexedDBServices';

export const createIndexedDBService = () => {
  const dbConfig = {
    databaseName: DATABASE.NAME,
    databaseVersion: DATABASE.VERSION,
    objectStoreName: DATABASE.OBJECT_STORE_NAME,
  };

  return new IndexedDBService(dbConfig);
};
