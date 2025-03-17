import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get<string>('AWS_REGION'),
    });

    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined in the configuration.');
    }
    this.bucketName = bucketName;
  }

  async uploadToS3(fileName: string, data: string): Promise<void> {
    try {
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: `clickstream/${fileName}`,
          Body: data,
          ContentType: 'application/json',
        })
        .promise();
      console.log(`File uploaded successfully: ${fileName}`);
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
  }
}
