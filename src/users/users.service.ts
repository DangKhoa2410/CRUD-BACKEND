import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      console.log('Email không tồn tại:', email);
      throw new UnauthorizedException('Email không tồn tại');
    }

    console.log('Email:', email);
    console.log('Password nhập vào:', password);
    console.log('Stored hashed password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Mật khẩu khớp:', isMatch);

    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    const accessToken = this.jwtService.sign({ id: user.id, role: user.role });
    const fullName = `${user.firstName} ${user.lastName}`;

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      fullName,
      role: user.role,
      email: user.email,
    };
  }
}
