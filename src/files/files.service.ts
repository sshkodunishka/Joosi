import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  async uploadFile(dataBuffer: Buffer, fileName: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: 'joosi',
        Body: dataBuffer,
        ACL: 'public-read',
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    const fileStorageInDB = {
      fileName: fileName,
      fileUrl: uploadResult.Location,
      key: uploadResult.Key,
    };

    return fileStorageInDB;
  }
}
