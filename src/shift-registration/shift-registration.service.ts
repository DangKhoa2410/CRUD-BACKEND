import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ShiftRegistration } from './entity/shift-registration.entity';
import { User } from '../users/user.entity';
import { WorkUser } from '../work-user/entities/work-user.entity';

@Injectable()
export class ShiftRegistrationService {
  constructor(
    @InjectRepository(ShiftRegistration)
    private readonly repo: Repository<ShiftRegistration>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async toggleShift(email: string, shift: 'ca-chieu' | 'ca-toi', date: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const createdAt = new Date(date);

    const existing = await this.repo.findOne({
      where: {
        user: { id: user.id },
        shift,
        created_at: Between(
          new Date(createdAt.setHours(0, 0, 0, 0)),
          new Date(createdAt.setHours(23, 59, 59, 999)),
        ),
      },
      relations: ['user'],
    });

    const workUserRepo = this.repo.manager.getRepository(WorkUser);

    if (existing) {
      await this.repo.remove(existing);

      // Nếu đã đăng ký thì xóa luôn bên work_users
      const workUser = await workUserRepo.findOne({
        where: {
          email: user.email,
          registeredDate: createdAt,
        },
      });
      if (workUser) {
        await workUserRepo.delete(workUser.id);
      }

      return { status: 'unregistered' };
    } else {
      const newReg = this.repo.create({
        user,
        shift,
        created_at: new Date(date),
      });
      await this.repo.save(newReg);

      const newWorkUser = workUserRepo.create({
        id: `${user.id}_${createdAt.toISOString()}`,
        nameUser: `${user.firstName} ${user.lastName}`,
        email: user.email,
        registeredDate: createdAt,
        shift: [shift],
      });
      await workUserRepo.save(newWorkUser);

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

  async getByDate(date: string) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const registrations = await this.repo.find({
      where: {
        created_at: Between(start, end),
        status: 'pending',
      },
      relations: ['user'],
    });

    return registrations.map((r) => ({
      email: r.user.email,
      fullName: `${r.user.firstName} ${r.user.lastName}`,
      shift: r.shift,
    }));
  }

  async getAllRegistrations() {
    const results = await this.repo.find({ relations: ['user'] });

    return results.map((r) => ({
      id: r.id,
      email: r.user.email,
      shift: r.shift,
      fullName: `${r.user.firstName} ${r.user.lastName}`,
      registeredDate: r.created_at.toISOString().split('T')[0],
      status: r.status,
    }));
  }

  async approve(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!item) throw new NotFoundException('Shift not found');

    item.status = 'approved';
    await this.repo.save(item);

    const workUserRepo = this.repo.manager.getRepository(WorkUser);

    const existingWorkUser = await workUserRepo.findOne({
      where: {
        email: item.user.email,
        registeredDate: item.created_at,
      },
    });

    if (existingWorkUser) {
      if (!existingWorkUser.shift.includes(item.shift)) {
        existingWorkUser.shift.push(item.shift);
        await workUserRepo.save(existingWorkUser);
      }
    } else {
      const newWorkUser = workUserRepo.create({
        id: `${item.user.id}_${item.created_at.toISOString()}`,
        nameUser: `${item.user.firstName} ${item.user.lastName}`,
        email: item.user.email,
        registeredDate: item.created_at,
        shift: [item.shift],
      });
      await workUserRepo.save(newWorkUser);
    }

    return { message: 'Shift approved and copied to work schedule' };
  }

  async remove(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Shift not found');
    return this.repo.remove(item);
  }

  async approveAllByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const registrations = await this.repo.find({
      where: { user: { id: user.id }, status: 'pending' },
      relations: ['user'],
    });

    for (const reg of registrations) {
      reg.status = 'approved';
      await this.repo.save(reg);
    }

    return { message: 'All shifts approved for user' };
  }

  async rejectAllByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const registrations = await this.repo.find({
      where: { user: { id: user.id }, status: 'pending' },
    });

    for (const reg of registrations) {
      reg.status = 'rejected';
      await this.repo.save(reg);
    }

    return { message: 'All shifts rejected for user' };
  }
}
