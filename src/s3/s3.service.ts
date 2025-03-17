import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
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
