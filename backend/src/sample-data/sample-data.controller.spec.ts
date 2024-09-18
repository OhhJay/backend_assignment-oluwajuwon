import { Test, TestingModule } from '@nestjs/testing';
import { SampleDataController } from './sample-data.controller';
import { SampleDataService } from './sample-data.service';

describe('SampleDataController', () => {
  let controller: SampleDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SampleDataController],
      providers: [SampleDataService],
    }).compile();

    controller = module.get<SampleDataController>(SampleDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
