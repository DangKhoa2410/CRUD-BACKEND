import { Test, TestingModule } from '@nestjs/testing';
import { ShiftRegistrationController } from './shift-registration.controller';

describe('ShiftRegistrationController', () => {
  let controller: ShiftRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftRegistrationController],
    }).compile();

    controller = module.get<ShiftRegistrationController>(
      ShiftRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
