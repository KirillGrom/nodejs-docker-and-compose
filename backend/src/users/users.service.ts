import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from '../helpers/hash';

const sanitizeUser = <T extends User | User[]>(user: T) => {
  if (Array.isArray(user)) {
    return user.map(({ password: _, ...rest }) => rest);
  }
  const { password: _, ...rest } = user;
  return rest;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findMany([
      createUserDto.email,
      createUserDto.username,
    ]);
    if (existingUser.length) {
      throw new BadRequestException('Такой пользователь уже существует');
    }
    const _password = await this._hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: _password,
    });
    return await this.userRepository.save(newUser);
  }

  async _hashPassword(password: string) {
    return await hashValue(password);
  }

  findById(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByUsername(username: string) {
    const [user] = await this.findMany(username);

    if (!user) throw new NotFoundException();

    return user;
  }

  async findAnotherUserWishes(username: string) {
    const user = await this.findByUsername(username);
    if (user) {
      const result = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ['wishes'],
      });

      return result.wishes ?? [];
    }
  }

  async getWishesMe(req) {
    const user = await this.userRepository.findOne({
      where: {
        id: req.user.userId,
      },
      relations: ['wishes'],
    });

    return user.wishes ?? [];
  }

  async updateOne(query: FindOneOptions<User>, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(query);
    if (updateUserDto?.password) {
      const _password = await this._hashPassword(updateUserDto.password);
      return await this.userRepository.save({
        ...user,
        ...updateUserDto,
        password: _password,
      });
    }
    if (updateUserDto.email !== user.email) {
      const userWithEmail = await this.findOne({
        where: {
          email: updateUserDto.email,
        },
      });
      if (userWithEmail) {
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }
    if (updateUserDto.username !== user.username) {
      const userWithEmail = await this.findOne({
        where: {
          username: updateUserDto.username,
        },
      });
      if (userWithEmail) {
        throw new ConflictException(
          'Пользователь с таким username уже зарегистрирован',
        );
      }
    }

    const { password, ...result } = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return result;
  }
  async findOne(query: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(query);

    if (!user) throw new NotFoundException();
    return user;
  }

  async removeOne(query: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(query);
    const result = await this.userRepository.remove(user);
    return sanitizeUser(result);
  }

  async findMany(query: string | string[]) {
    const queryTerms = Array.isArray(query) ? query : [query];
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where(
        queryTerms
          .map((term) => [{ username: term }, { email: term }])
          .reduce((acc, curr) => [...acc, ...curr], []),
      )
      .getMany();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
}
