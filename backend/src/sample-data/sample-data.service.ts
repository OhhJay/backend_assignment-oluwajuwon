import { Injectable } from '@nestjs/common'; 
import { CreateSampleDatumDto } from './dto/create-sample-datum.dto';
import { UpdateSampleDatumDto } from './dto/update-sample-datum.dto';
import { Document } from '@prisma/client'; 
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';

@Injectable()
export class SampleDataService {

  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createSampleDatumDto: CreateSampleDatumDto) {
    try {
      const newDocument = await this.prisma.document.create({
        data: createSampleDatumDto,
      });
      return    newDocument;
      
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const documents = await this.prisma.document.findMany({
        include:{
          uploadedByUser:true
        }
      });
      return {
        message: 'Documents retrieved successfully',
        data: documents,
      };
    } catch (error) {
      throw new Error(`Error retrieving documents: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id },
        include:{
          uploadedByUser:true
        }
      });
      if (!document) {
        throw new Error(`Document with id ${id} not found`);
      }
      return {
        message: 'Document retrieved successfully',
        data: document,
      };
    } catch (error) {
      throw new Error(`Error retrieving document: ${error.message}`);
    }
  }

  async update(id: number, updateSampleDatumDto: UpdateSampleDatumDto) {
    try {
      console.log(updateSampleDatumDto)
      const updatedDocument = await this.prisma.document.update({
        where: { id },
        data: updateSampleDatumDto,
      });
      return {
        message: 'Document updated successfully',
        data: updatedDocument,
      };
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.document.delete({
        where: { id },
      });
      return {
        message: 'Document deleted successfully',
      };
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  async upsertDocuments(documents: any[]): Promise<Document[]> {
    try {
      const promises = documents.map((doc) =>
        this.prisma.document.create({
          data:{
          title: doc.title,
          description: doc.description ?? null,
          content: doc.content,
          createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
          updatedAt: new Date(),
          uploadedBy: doc.uploadedBy ?? null,
          sensitiveData: doc.sensitiveData ?? null,}
        })
         
        
      );
  
      return Promise.all(promises);
    } catch (error) {
      throw new Error(`Error upserting documents: ${error.message}`);
    }
  }
  
}
