import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('work_users')
export class WorkUser {
  @PrimaryColumn()
  id: string;

  @Column()
  nameUser: string;

  @Column()
  email: string;

  @Column({ type: 'date' })
  registeredDate: Date;

  @Column('simple-array')
  shift: ('ca-chieu' | 'ca-toi')[];
}
