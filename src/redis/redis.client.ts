import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClientType, SetOptions, createClient } from 'redis';

@Injectable()
export class RedisClient implements OnModuleInit {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    });

    this.client.on('connect', () => {
      console.log(`Redis connection established`);
    });

    this.client.on('error', (error) => {
      console.error(`Redis error, service degraded: ${error}`);
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    await this.client.connect();
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.client.get(key);
    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, options: SetOptions): Promise<void> {
    await this.client.set(key, JSON.stringify(value), options);
  }

  async quit() {
    await this.client.quit();
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
