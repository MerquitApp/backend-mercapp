import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { R2Buckets } from './constants';

@Injectable()
export class ObjectStorageService {
  private s3: S3;
  private MERC_APP_UPLOAD_URL: string;

  constructor(private readonly configService: ConfigService) {
    const accountid = this.configService.get('R2_ACCOUNT_ID');
    const access_key_id = this.configService.get('R2_ACCESS_KEY_ID');
    const access_key_secret = this.configService.get('R2_ACCESS_KEY_SECRET');

    this.s3 = new S3({
      endpoint: `https://${accountid}.r2.cloudflarestorage.com`,
      accessKeyId: access_key_id,
      secretAccessKey: access_key_secret,
      signatureVersion: 'v4',
    });

    this.MERC_APP_UPLOAD_URL = this.configService.get('R2_UPLOAD_URL');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const imageName =
      crypto.randomUUID() + '.' + file.originalname.split('.').pop();
    const params = {
      Bucket: R2Buckets.MERCAPP,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.upload(params).promise();

    return this.MERC_APP_UPLOAD_URL + imageName;
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: R2Buckets.MERCAPP,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  async deleteFileByUrl(url: string): Promise<void> {
    const key = url.replace(this.MERC_APP_UPLOAD_URL, '');
    await this.deleteFile(key);
  }

  async getFileUrl(id: string): Promise<string> {
    const params = {
      Bucket: R2Buckets.MERCAPP,
      Key: id,
    };

    const url = await this.s3.getSignedUrlPromise('getObject', params);

    return url;
  }
}
