import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule /* 다른 모듈들 */],
})
export class AppModule {}
