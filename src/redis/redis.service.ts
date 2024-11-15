import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async set(
    key: string,
    field: string,
    value: string,
    expireSeconds?: number,
    page?: number,
  ): Promise<void> {
    if (page) {
      const fullKey = `${key}:${field}:${page}`;
      await this.redisClient.set(fullKey, value);
      if (expireSeconds) {
        await this.redisClient.expire(fullKey, expireSeconds);
      }
    } else {
      await this.redisClient.hset(key, field, value);
      if (expireSeconds) {
        await this.redisClient.expire(key, expireSeconds);
      }
    }
  }

  async getAllField(key: string) {
    return await this.redisClient.hgetall(key);
  }

  async get(key: string, field: string, page?: number): Promise<string | null> {
    if (page) {
      const fullKey = `${key}:${field}:${page}`;
      const data = await this.redisClient.get(fullKey);
      return data;
    } else {
      return await this.redisClient.hget(key, field);
    }
  }

  async check(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

  async deleteKey(key: string, field?: string, page?: number): Promise<void> {
    if (field && page) {
      const fullKey = `${key}:${field}:${page}`;
      await this.redisClient.del(fullKey);
    } else if (field) {
      const keys = await this.redisClient.keys(`${key}:${field}:*`);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } else {
      await this.redisClient.del(key);
    }
  }

  async delete(key: string, field: string): Promise<void> {
    await this.redisClient.hdel(key, field);
  }

  async clear(): Promise<void> {
    await this.redisClient.flushall();
  }
}
