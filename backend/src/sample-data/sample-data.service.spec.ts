import { Test, TestingModule } from '@nestjs/testing';
import { SampleDataService } from './sample-data.service';
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { Document } from '@prisma/client';
import { CreateSampleDatumDto } from './dto/create-sample-datum.dto';

describe('SampleDataService', () => {
  let service: SampleDataService;
  let prisma: PrismaDatabaseService;

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SampleDataService,
        { provide: PrismaDatabaseService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SampleDataService>(SampleDataService);
    prisma = module.get<PrismaDatabaseService>(PrismaDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createSampleDatumDto :CreateSampleDatumDto= {
        title: 'Test Document',
        description: 'A test document',
        content: 'Document content',
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedBy: 1,
        sensitiveData: 'Sensitive data',
      };

      const createdDocument = { id: 1, ...createSampleDatumDto };
      mockPrismaService.document.create.mockResolvedValue(createdDocument);

      const result = await service.create(createSampleDatumDto);
      expect(result).toEqual(createdDocument);
      expect(mockPrismaService.document.create).toHaveBeenCalledWith({
        data: createSampleDatumDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const documents = [
        { id: 1, title: 'Test Document 1' },
        { id: 2, title: 'Test Document 2' },
      ];

      mockPrismaService.document.findMany.mockResolvedValue(documents);

      const result = await service.findAll();
      expect(result).toEqual({
        message: 'Documents retrieved successfully',
        data: documents,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single document by id', async () => {
      const document = { id: 1, title: 'Test Document' };
      mockPrismaService.document.findUnique.mockResolvedValue(document);

      const result = await service.findOne(1);
      expect(result).toEqual({
        message: 'Document retrieved successfully',
        data: document,
      });
    });

    it('should throw an error if the document is not found', async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError('Document with id 1 not found');
    });
  });

  describe('update', () => {
    it('should update a document by id', async () => {
      const updateSampleDatumDto = { title: 'Updated Document' };
      const updatedDocument = { id: 1, ...updateSampleDatumDto };
      mockPrismaService.document.update.mockResolvedValue(updatedDocument);

      const result = await service.update(1, updateSampleDatumDto);
      expect(result).toEqual({
        message: 'Document updated successfully',
        data: updatedDocument,
      });
    });
  });

  describe('remove', () => {
    it('should delete a document by id', async () => {
      mockPrismaService.document.delete.mockResolvedValue(undefined);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Document deleted successfully' });
    });
  });

  describe('upsertDocuments', () => {
    it('should upsert multiple documents', async () => {
      const documents = [
        { title: 'Doc 1', content: 'Content 1' },
        { title: 'Doc 2', content: 'Content 2' },
      ];

      const upsertedDocuments = documents.map((doc, index) => ({ id: index + 1, ...doc }));
      mockPrismaService.document.create.mockImplementation(doc => Promise.resolve({ id: Date.now(), ...doc }));

      const result = await service.upsertDocuments(documents);
      expect(result).toEqual(upsertedDocuments);
    });
  });
});
