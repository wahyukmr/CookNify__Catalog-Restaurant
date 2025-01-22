import { openDB } from 'idb';

class IndexedDBService {
  constructor({
    databaseName,
    databaseVersion,
    objectStoreName,
    keyPath = 'id',
    mode = 'readwrite',
  }) {
    this.databaseName = databaseName;
    this.databaseVersion = databaseVersion;
    this.objectStoreName = objectStoreName;
    this.keyPath = keyPath;
    this.mode = mode;
    this.dbPromise = openDB(this.databaseName, this.databaseVersion, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains(this.objectStoreName)) {
          db.createObjectStore(this.objectStoreName, { keyPath: this.keyPath });
        }
      },
    });
  }

  async get(id) {
    return (await this.dbPromise).get(this.objectStoreName, id);
  }

  async getAll() {
    return (await this.dbPromise).getAll(this.objectStoreName);
  }

  async put(item) {
    return (await this.dbPromise).put(this.objectStoreName, item);
  }

  async bulkPut(items) {
    const db = await this.dbPromise;
    const tx = db.transaction(this.objectStoreName, this.mode);
    const store = tx.store;

    items.forEach((item) => store.put(item));
    await tx.done;
  }

  async delete(id) {
    return (await this.dbPromise).delete(this.objectStoreName, id);
  }
}

export default IndexedDBService;
