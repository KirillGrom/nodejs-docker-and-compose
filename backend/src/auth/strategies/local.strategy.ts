import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { hashValue } from "../../helpers/hash";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    try {
      const user = await this.usersService.findOne({
        where: { username },
        select: ['password', 'id'],
      });
      const isValid = await this.authService.validatePassword({
        userPassword: user.password,
        password,
      });
      if (!user || !isValid) {
        throw new UnauthorizedException('Неверный пароль или юзернайм');
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException('Неверный пароль или юзернайм');
    }
  }
}
