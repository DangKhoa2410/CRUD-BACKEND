import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkUser } from './entities/work-user.entity';
import { WorkUserService } from './work-user.service';
import { WorkUserController } from './work-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkUser])],
  controllers: [WorkUserController],
  providers: [WorkUserService],
})
export class WorkUserModule {}
