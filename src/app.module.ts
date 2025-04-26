import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ShiftRegistrationModule } from './shift-registration/shift-registration.module';
import { WorkUserModule } from './work-user/work-user.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'crud_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    JwtModule.register({
      secret: '123',
      signOptions: { expiresIn: '1h' },
    }),
    ShiftRegistrationModule,
    WorkUserModule,
  ],
})
export class AppModule {}
