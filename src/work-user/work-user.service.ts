import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkUser } from './entities/work-user.entity';
import { CreateWorkUserDto } from './dto/create-work-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkUserService {
  constructor(
    @InjectRepository(WorkUser)
    private readonly workUserRepo: Repository<WorkUser>,
  ) {}

  async create(dto: CreateWorkUserDto): Promise<WorkUser> {
    const user = this.workUserRepo.create({
      id: uuidv4(),
      ...dto,
      registeredDate: new Date(dto.registeredDate),
    });
    return this.workUserRepo.save(user);
  }

  async update(id: string, dto: CreateWorkUserDto): Promise<WorkUser> {
    const user = await this.workUserRepo.findOneBy({ id });
    if (!user) throw new Error('User not found');

    user.nameUser = dto.nameUser;
    user.email = dto.email;
    user.registeredDate = new Date(dto.registeredDate);
    user.shift = dto.shift;

    return this.workUserRepo.save(user);
  }

  async findAll(): Promise<WorkUser[]> {
    return this.workUserRepo.find();
  }

  async remove(id: string): Promise<void> {
    await this.workUserRepo.delete(id);
  }
}
