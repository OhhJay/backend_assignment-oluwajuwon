import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, NotFoundException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';
import { Roles } from 'src/utils/decorators/role-permission.decorator';
import { SampleDataService } from './sample-data.service';
import { CreateSampleDatumDto } from './dto/create-sample-datum.dto';
import { UpdateSampleDatumDto } from './dto/update-sample-datum.dto';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Document } from '@prisma/client'; // Import Document type if needed
import multer from 'multer';

import * as fs from 'fs';
@Controller('documents')
export class SampleDataController {
  constructor(private readonly documentService: SampleDataService) {}

  @Post()

@UseGuards(JwtAuthGuard,)
  async createDocument(@Body() createDocumentDto: CreateSampleDatumDto) {
    try {
      const createdDocument = await this.documentService.create(createDocumentDto);
      return {
        message: 'Document created successfully',
        data: createdDocument,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesPermissionsGuard)
  @Roles('Super Admin', 'HR')
  async getDocumentById(@Param('id') id: number) {
    try {
      const document = await this.documentService.findOne(id);
      if (!document) {
        throw new NotFoundException(`Document with id ${id} not found`);
      }
      return {
        message: 'Document retrieved successfully',
        data: document,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()

@UseGuards(JwtAuthGuard,)
   async getAllDocuments() {
    try {
      const documents = await this.documentService.findAll();
      return {
        message: 'Documents retrieved successfully',
        data: documents,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesPermissionsGuard)
  @Roles('Super Admin', 'HR')
  async updateDocument(@Param('id') id: number, @Body() updateDocumentDto: UpdateSampleDatumDto) {
    try {
      console.log(id)
      const updatedDocument = await this.documentService.update(id, updateDocumentDto);
      return {
        message: 'Document updated successfully',
        data: updatedDocument,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesPermissionsGuard)
  @Roles('Super Admin', 'HR')
  async deleteDocument(@Param('id') id: number) {
    try {
      await this.documentService.remove(+id);
      return {
        message: 'Document deleted successfully',
        status: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      console.log(error)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }



  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        // Filter only CSV files
        if (!file.mimetype.includes('csv')) {
          return callback(
            new HttpException('Only CSV files are allowed', HttpStatus.BAD_REQUEST),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('File received:', file);

    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Process the CSV file
    try {
      const documents = await this.parseCsv(file.path);
      console.log(documents)
      await this.documentService.upsertDocuments(documents);

      return {
        message: 'File uploaded and data processed successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  

 
private async parseCsv(filePath: string): Promise<any[]> {
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({
        separator:",",
        headers:["title","description","content","uploadedBy","sensitiveData"],
        
      }))
      .on('data', (data) => {
        console.log(data)
        // Ensure correct data types
        results.push({
          title: data.title?.trim() || null,
          description: data.description?.trim() || null,
          content: data.content?.trim() || null,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date(), // Handle date conversion
          updatedAt: data.updatedAt? new Date(data.updatedAt).toISOString() : new Date(), // Handle date conversion
          uploadedBy: Number(data.uploadedBy) || null, // Convert to number
          sensitiveData: data.sensitiveData?.trim() || null,
        });
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
}
