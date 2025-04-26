import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { WorkUserService } from './work-user.service';
import { CreateWorkUserDto } from './dto/create-work-user.dto';

@Controller('work-users')
export class WorkUserController {
  constructor(private readonly workUserService: WorkUserService) {}

  @Post()
  create(@Body() dto: CreateWorkUserDto) {
    return this.workUserService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateWorkUserDto) {
    return this.workUserService.update(id, dto);
  }

  @Get()
  findAll() {
    return this.workUserService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workUserService.remove(id);
  }
}
