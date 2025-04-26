import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class ShiftRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['ca-chieu', 'ca-toi'],
  })
  shift: 'ca-chieu' | 'ca-toi';

  @ManyToOne(() => User, (user) => user.shiftRegistrations, { eager: false })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';
}
