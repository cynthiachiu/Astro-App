import { Test, TestingModule } from '@nestjs/testing';
import { AstronautController } from './astronaut.controller';

describe('AstronautController', () => {
  let controller: AstronautController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AstronautController],
    }).compile();

    controller = module.get<AstronautController>(AstronautController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
