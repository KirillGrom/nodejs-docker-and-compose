import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ResponseSigninDto } from './dto/response-signin.dto';
import { hashValue, verifyHash } from "../helpers/hash";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  create(payload) {
    return this.usersService.create(payload);
  }
  async validatePassword({
    password,
    userPassword,
  }: {
    password: string;
    userPassword: string;
  }) {
    return await verifyHash(password, userPassword);
  }
  async auth(user: User): Promise<ResponseSigninDto> {
    const { username, id: sub } = user;
    return { access_token: await this.jwtService.signAsync({ username, sub }) };
  }
}
