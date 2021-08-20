import { Test, TestingModule } from '@nestjs/testing';
import { AstronautService } from './astronaut.service';

describe('AstronautService', () => {
  let service: AstronautService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AstronautService],
    }).compile();

    service = module.get<AstronautService>(AstronautService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
