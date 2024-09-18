import { Test, TestingModule } from '@nestjs/testing';
import { SampleDataController } from './sample-data.controller';
import { SampleDataService } from './sample-data.service';
import { CreateSampleDatumDto } from './dto/create-sample-datum.dto';
import { UpdateSampleDatumDto } from './dto/update-sample-datum.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesPermissionsGuard } from 'src/utils/guards/role-and-permission.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Express } from 'express';

describe('SampleDataController', () => {
  let controller: SampleDataController;
  let service: SampleDataService;

  const mockService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    upsertDocuments: jest.fn(),
  };

  const mockFile = {
    path: 'mock-file-path.csv',
    mimetype: 'text/csv',
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SampleDataController],
      providers: [
        { provide: SampleDataService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesPermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SampleDataController>(SampleDataController);
    service = module.get<SampleDataService>(SampleDataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDocument', () => {
    it('should create a document successfully', async () => {
      const dto: CreateSampleDatumDto = { title: 'Test', content: 'Content' };
      const result = { id: 1, ...dto };
      mockService.create.mockResolvedValue(result);

      const response = await controller.createDocument(dto);
      expect(response).toEqual({
        message: 'Document created successfully',
        data: result,
        status: HttpStatus.CREATED,
      });
    });

    it('should handle errors while creating a document', async () => {
      const dto: CreateSampleDatumDto = { title: 'Test', content: 'Content' };
      mockService.create.mockRejectedValue(new Error('Error'));

      await expect(controller.createDocument(dto)).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Error',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const result = { id: 1, title: 'Test Document' };
      mockService.findOne.mockResolvedValue(result);

      const response = await controller.getDocumentById(1);
      expect(response).toEqual({
        message: 'Document retrieved successfully',
        data: result,
        status: HttpStatus.OK,
      });
    });

    it('should handle errors if document is not found', async () => {
      mockService.findOne.mockResolvedValue(null);

      await expect(controller.getDocumentById(1)).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Document with id 1 not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents', async () => {
      const documents = [{ id: 1, title: 'Test Document' }];
      mockService.findAll.mockResolvedValue({
        message: 'Documents retrieved successfully',
        data: documents,
      });

      const response = await controller.getAllDocuments();
      expect(response).toEqual({
        message: 'Documents retrieved successfully',
        data: documents,
        status: HttpStatus.OK,
      });
    });

    it('should handle errors while retrieving all documents', async () => {
      mockService.findAll.mockRejectedValue(new Error('Error'));

      await expect(controller.getAllDocuments()).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateDocument', () => {
    it('should update a document successfully', async () => {
      const dto: UpdateSampleDatumDto = { title: 'Updated Title' };
      const result = { id: 1, ...dto };
      mockService.update.mockResolvedValue(result);

      const response = await controller.updateDocument(1, dto);
      expect(response).toEqual({
        message: 'Document updated successfully',
        data: result,
        status: HttpStatus.OK,
      });
    });

    it('should handle errors while updating a document', async () => {
      const dto: UpdateSampleDatumDto = { title: 'Updated Title' };
      mockService.update.mockRejectedValue(new Error('Error'));

      await expect(controller.updateDocument(1, dto)).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Error',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document successfully', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const response = await controller.deleteDocument(1);
      expect(response).toEqual({
        message: 'Document deleted successfully',
        status: HttpStatus.NO_CONTENT,
      });
    });

    it('should handle errors while deleting a document', async () => {
      mockService.remove.mockRejectedValue(new Error('Error'));

      await expect(controller.deleteDocument(1)).rejects.toThrowError(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Error',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
 
});
