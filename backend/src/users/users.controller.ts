import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  async me(@Req() req, @Body() payload: UpdateUserDto) {
    return await this.usersService.updateOne(
      {
        where: {
          id: req.user.userId,
        },
      },
      payload,
    );
  }
  @Get('/me')
  async getUserMe(@Req() req) {
    return await this.usersService.findOne({
      where: { id: req.user.userId },
    });
  }

  @Get('/me/wishes')
  async getWishesMe(@Req() req) {
    return await this.usersService.getWishesMe(req);
  }

  @Get('/:username')
  async findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get('/:username/wishes')
  async getWishes(@Param('username') username: string) {
    return await this.usersService.findAnotherUserWishes(username);
  }

  @Post('/find')
  async findUsers(@Body() findUserDto: FindUserDto) {
    const user = await this.usersService.findMany(findUserDto.query);
    return user;
  }
}
