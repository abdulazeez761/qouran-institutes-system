import { Test, TestingModule } from '@nestjs/testing';
import { StudentWirdsController } from './student-wirds.controller';
import { StudentWirdsService } from './student-wirds.service';

describe('StudentWirdsController', () => {
  let controller: StudentWirdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentWirdsController],
      providers: [StudentWirdsService],
    }).compile();

    controller = module.get<StudentWirdsController>(StudentWirdsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
