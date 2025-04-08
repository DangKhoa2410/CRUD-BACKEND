import { Test, TestingModule } from '@nestjs/testing';
import { ShiftRegistrationService } from './shift-registration.service';

describe('ShiftRegistrationService', () => {
  let service: ShiftRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShiftRegistrationService],
    }).compile();

    service = module.get<ShiftRegistrationService>(ShiftRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
