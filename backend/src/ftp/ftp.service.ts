import { Injectable, Logger } from '@nestjs/common';
import * as FTP from 'ftp';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream'; // Import Readable stream
import { PrismaDatabaseService } from 'src/databases/prisma-database.service';
import { promisify } from 'util';

@Injectable()
export class FtpService {
  private readonly logger = new Logger(FtpService.name);
  private ftpClient = new FTP();

  constructor(private readonly prisma: PrismaDatabaseService) {
    this.connect();
  }

  private connect() {
    this.ftpClient.connect({
      host: 'ftp.example.com',
      user: 'username',
      password: 'password',
    });

    this.ftpClient.on('error', (err) => {
      this.logger.error('FTP client error:', err);
    });
  }

  async listFiles(directory: string): Promise<string[]> {
    const list = promisify(this.ftpClient.list).bind(this.ftpClient);
    try {
      const files = await list(directory);
      return files.map(file => file.name);
    } catch (err) {
      this.logger.error('Error listing files:', err);
      throw err;
    }
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.ftpClient.get(filePath, (err, stream) => {
        if (err) return reject(err);
        let data = Buffer.from([]);
        stream.on('data', chunk => (data = Buffer.concat([data, chunk])));
        stream.on('end', () => resolve(data));
        stream.on('error', (error) => reject(error));
      });
    });
  }

  async processCsv(filePath: string) {
    try {
      const fileData = await this.downloadFile(filePath);
      const readableStream = new Readable();
      readableStream.push(fileData);
      readableStream.push(null); // End of stream

      const records: any[] = [];
      const parser = readableStream.pipe(csvParser());

      parser.on('data', (row) => records.push(row));
      parser.on('end', async () => {
        for (const record of records) {
          try {
            const exists = await this.prisma.document.findUnique({ where: { id: record.id } });
            if (!exists) {
              await this.prisma.document.create({ data: record });
            }
          } catch (err) {
            this.logger.error('Error processing record:', record, err);
          }
        }
      });

      parser.on('error', (error) => {
        this.logger.error('CSV parsing error:', error);
      });
    } catch (err) {
      this.logger.error('Error processing CSV:', err);
    }
  }
}
