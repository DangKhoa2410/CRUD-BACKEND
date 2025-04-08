import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShiftRegistration } from '../shift-registration/entity/shift-registration.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => ShiftRegistration, (reg) => reg.user)
  shiftRegistrations: ShiftRegistration[];
}
