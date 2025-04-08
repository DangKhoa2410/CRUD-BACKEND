import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftRegistration } from './entity/shift-registration.entity';
import { ShiftRegistrationService } from './shift-registration.service';
import { ShiftRegistrationController } from './shift-registration.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftRegistration]), UsersModule],
  providers: [ShiftRegistrationService],
  controllers: [ShiftRegistrationController],
})
export class ShiftRegistrationModule {}
