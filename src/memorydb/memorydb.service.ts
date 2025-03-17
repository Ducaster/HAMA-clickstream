import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class MemoryDBService {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('MEMORYDB_HOST'),
      port: this.configService.get<number>('MEMORYDB_PORT'),
      tls: {},
      connectTimeout: 10000, // 연결 시간 초과 설정 (10초)
      retryStrategy: (times) => Math.min(times * 500, 2000), // 재시도 전략 설정
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully!');
    });
  }

  async getUserData(googleId: string): Promise<any> {
    try {
      const userData = await this.redis.get(`user:${googleId}`);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('MemoryDB Fetch Error:', error);
      return null;
    }
  }
}
