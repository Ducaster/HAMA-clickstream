import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MemoryDBService } from '../memorydb/memorydb.service';
import { S3Service } from '../s3/s3.service';
import { Request } from 'express';

// Request 인터페이스 확장
interface CustomRequest extends Request {
  googleId: string; // googleId 속성 추가
}

@Controller('track-click')
export class ClickTrackingController {
  constructor(
    private readonly memoryDBService: MemoryDBService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async trackClick(@Req() req: CustomRequest, @Body() clickData: any) {
    const user = req.googleId; // JWT에서 추출된 사용자 정보
    const userData = await this.memoryDBService.getUserData(user);

    if (!userData) {
      return { message: 'User data not found' };
    }

    // 아이 정보 정리
    const children = userData.additionalInfo.children || [];
    const babyInfo = children.map((child) => ({
      age: this.calculateAge(child.birthdate),
      gender: child.gender,
    }));

    // 클릭스트림 데이터 구성
    const enrichedClickData = {
      userId: user,
      babyInfo: {
        count: children.length,
        details: babyInfo,
      },
      product: clickData.product,
      timestamp: new Date().toISOString(),
    };

    // S3 저장
    const fileName = `clickstream/${Date.now()}-${Math.random()}.json`;
    await this.s3Service.uploadToS3(
      fileName,
      JSON.stringify(enrichedClickData),
    );

    return { message: 'Click data saved with baby info' };
  }

  private calculateAge(birthdate: string): number {
    const birth = new Date(birthdate);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  }
}
