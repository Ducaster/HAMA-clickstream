import { Module } from '@nestjs/common';
import { ClickTrackingController } from './track.controller';
import { MemoryDBService } from '../memorydb/memorydb.service';
import { MemoryDBModule } from '../memorydb/memorydb.module';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [MemoryDBModule],
  controllers: [ClickTrackingController],
  providers: [MemoryDBService, S3Service],
})
export class ClickTrackingModule {}
