import { connection } from "../queue/queue-factory.js";

export class CacheService {
  private static instance: CacheService;

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get a value from the cache.
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = await connection.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`[CacheService] Failed to get key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in the cache with a TTL (Time To Live).
   * Default TTL is 300 seconds (5 minutes).
   */
  public async set(
    key: string,
    value: any,
    ttlSeconds: number = 300,
  ): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await connection.set(key, stringValue, "EX", ttlSeconds);
    } catch (error) {
      console.error(`[CacheService] Failed to set key ${key}:`, error);
    }
  }

  /**
   * Delete a key from the cache.
   */
  public async delete(key: string): Promise<void> {
    try {
      await connection.del(key);
    } catch (error) {
      console.error(`[CacheService] Failed to delete key ${key}:`, error);
    }
  }

  /**
   * Helper to cache expensive database lookups.
   */
  public async wrap<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }
}
