import { Test, TestingModule } from '@nestjs/testing';
import { SampleDataService } from './sample-data.service';

describe('SampleDataService', () => {
  let service: SampleDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SampleDataService],
    }).compile();

    service = module.get<SampleDataService>(SampleDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
