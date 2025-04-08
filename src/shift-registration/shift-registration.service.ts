import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftRegistration } from './entity/shift-registration.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ShiftRegistrationService {
  constructor(
    @InjectRepository(ShiftRegistration)
    private readonly repo: Repository<ShiftRegistration>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async toggleShift(email: string, shift: 'ca-chieu' | 'ca-toi') {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.repo.findOne({
      where: { user: { id: user.id }, shift },
      relations: ['user'],
    });

    if (existing) {
      await this.repo.remove(existing);
      return { status: 'unregistered' };
    } else {
      const newReg = this.repo.create({ user, shift });
      await this.repo.save(newReg);
      return { status: 'registered' };
    }
  }

  async getByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const results = await this.repo.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    return results.map((r) => ({
      email: r.user.email,
      shift: r.shift,
      fullName: `${r.user.firstName} ${r.user.lastName}`,
    }));
  }

  async getAllRegistrations() {
    const results = await this.repo.find({ relations: ['user'] });

    return results.map((r) => ({
      email: r.user.email,
      shift: r.shift,
      fullName: `${r.user.firstName} ${r.user.lastName}`,
    }));
  }
}
