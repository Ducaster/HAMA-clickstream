import { Module } from '@nestjs/common';
import { MemoryDBService } from './memorydb.service';

@Module({
  providers: [MemoryDBService],
  exports: [MemoryDBService], // 다른 모듈에서 사용할 수 있도록 내보냄
})
export class MemoryDBModule {}
