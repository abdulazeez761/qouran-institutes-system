import { Test, TestingModule } from '@nestjs/testing';
import { StudentWirdsService } from './student-wirds.service';

describe('StudentWirdsService', () => {
  let service: StudentWirdsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentWirdsService],
    }).compile();

    service = module.get<StudentWirdsService>(StudentWirdsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
