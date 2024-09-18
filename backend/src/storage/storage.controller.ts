// import {
//   Body,
//   Controller,
//   Get,
//   HttpException,
//   HttpStatus,
//   NotFoundException,
//   Param,
//   Post,
//   Res,
//   ServiceUnavailableException,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express'; 

// const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
// const bucket = storage.bucket('foodco');

// @Controller('media')
// export class MediaController {
//   constructor(private storageService: StorageService) {}

//   @Get('/:mediaId')
//   async downloadMedia(
//     @Param('mediaId') mediaId: string,
//     @Res() res: Response,
//   ): Promise<any> {
//     let storageFile: StorageFile;
//     try {
//       storageFile = await this.storageService.get('media/' + mediaId);
//     } catch (e) {
//       if (e.message.toString().includes('No such object')) {
//         throw new NotFoundException('image not found');
//       } else {
//         throw new ServiceUnavailableException('internal error');
//       }
//     }
//     res.setHeader('Content-Type', storageFile.contentType);
//     res.setHeader('Cache-Control', 'max-age=60d');
//     res.end(storageFile.buffer);
//   }

//   @Get('list')
//   async getListFiles(@Res() res: Response): Promise<void> {
//     try {
//       const [files] = await bucket.getFiles();
//       const fileInfos = files.map((file) => ({
//         name: file.name,
//         url: file.metadata.mediaLink,
//       }));

//       res.status(HttpStatus.OK).send(fileInfos);
//     } catch (err) {
//       throw new HttpException(
//         'Unable to read list of files!',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Get('download/:name')
//   async download(
//     @Param('name') name: string,
//     @Res() res: Response,
//   ): Promise<void> {
//     try {
//       const [metaData] = await bucket.file(name).getMetadata();
//       res.redirect(metaData.mediaLink);
//     } catch (err) {
//       throw new HttpException(
//         `Could not download the file. ${err}`,
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Post('upload-file')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
//     return this.storageService.uploadFile(file);
//   }
// }
