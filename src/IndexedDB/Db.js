
import { openDB } from 'idb';

const DB_NAME = 'GeoMapDB';
const STORE_NAME = 'geojson';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveGeoData = async (data) => {
  const db = await initDB();
  await db.put(STORE_NAME, data, 'geodata');
};

export const getGeoData = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, 'geodata');
};

export const clearGeoData = async () => {
  const db = await initDB();
  await db.delete(STORE_NAME, 'geodata');
};
