// import { config } from 'app/config/config';
// import { DownloadResponse, Storage } from '@google-cloud/storage';
// import { Injectable } from '@nestjs/common';
// import { StorageFile } from 'JwtService/config/storage-file';
// import googleCloudConfig from 'src/config/google-cloud.config';
// import { v4 as uuid } from 'uuid';

// const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
// const bucket = storage.bucket('foodco');

// @Injectable()
// export class StorageService {
//   private storage: Storage;
//   private bucket: any;

//   constructor() {
//     this.storage = storage;
//     this.bucket = bucket;
//   }

//   async save(
//     path: string,
//     contentType: string,
//     media: Buffer,
//     metadata: { [key: string]: string }[],
//   ): Promise<any> {
//     const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
//     const file = this.storage.bucket(this.bucket).file(path);
//     const stream = file.createWriteStream();
//     stream.on('finish', async () => {
//       return await file.setMetadata({
//         metadata: object,
//       });
//     });
//     stream.end(media);
//   }

//   async delete(path: string): Promise<any> {
//     await this.storage
//       .bucket(this.bucket)
//       .file(path)
//       .delete({ ignoreNotFound: true });
//   }

//   async get(path: string): Promise<StorageFile> {
//     const fileResponse: DownloadResponse = await this.storage
//       .bucket(this.bucket)
//       .file(path)
//       .download();
//     const [buffer] = fileResponse;
//     const storageFile = new StorageFile();
//     storageFile.buffer = buffer;
//     storageFile.metadata = new Map<string, string>();
//     return storageFile;
//   }

//   async getWithMetaData(path: string): Promise<StorageFile> {
//     const [metadata] = await this.storage
//       .bucket(this.bucket)
//       .file(path)
//       .getMetadata();
//     const fileResponse: DownloadResponse = await this.storage
//       .bucket(this.bucket)
//       .file(path)
//       .download();
//     const [buffer] = fileResponse;

//     const storageFile = new StorageFile();
//     storageFile.buffer = buffer;
//     storageFile.metadata = new Map<string, string>(
//       Object.entries(metadata || {}).map(([key, value]) => [
//         key,
//         String(value),
//       ]),
//     );

//     storageFile.contentType = storageFile.metadata.get('contentType');
//     return storageFile;
//   }

//   public async generateUniqueFileName(
//     originalFilename: string,
//   ): Promise<string> {
//     const timestamp = Date.now();
//     const randomId = uuid().replace(/-/g, '');

//     const fileNameWithoutExtension = originalFilename
//       .split('.')
//       .slice(0, -1)
//       .join('.');
//     const fileExtension = originalFilename.split('.').pop();

//     // Remove spaces from the original filename
//     const cleanFileName = fileNameWithoutExtension.replace(/\s+/g, '');

//     return `${cleanFileName}-${timestamp}-${randomId}.${fileExtension}`;
//   }

//   public async uploadFile(file: Express.Multer.File): Promise<any> {
//     const filePath = file.path;
//     const uniqueFileName = await this.generateUniqueFileName(file.originalname);
//     const destFileName = uniqueFileName;
//     const generationMatchPrecondition = 0;

//     const options = {
//       destination: destFileName,
//       preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
//     };

//     await this.storage.bucket(bucket?.name).upload(filePath, options);
//     console.log(`${filePath} uploaded to ${bucket?.name}`);

//     return {
//       fileName: destFileName,
//       url: `https://storage.googleapis.com/${bucket.name}/${destFileName}`,
//     };
//   }
// }
