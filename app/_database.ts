
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('favorites.db');


export async function initDb() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY NOT NULL,
      movie TEXT NOT NULL
    );
  `);
}

export async function addFavorite(id: string, movie: object) {
  await db.runAsync(
    'INSERT OR REPLACE INTO favorites (id, movie) VALUES (?, ?)',
    [id, JSON.stringify(movie)]
  );
}

export async function removeFavorite(id: string) {
  await db.runAsync('DELETE FROM favorites WHERE id = ?', [id]);
}

export async function getFavorites(): Promise<any[]> {
  const result = await db.getAllAsync<{ id: string; movie: string }>(
    'SELECT * FROM favorites'
  );
  return result.map(row => JSON.parse(row.movie));
}


export async function isMarkedFavorite(id: string): Promise<boolean> {
  const result = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM favorites WHERE id = ?',
    [id]
  );
  return !!result;
}