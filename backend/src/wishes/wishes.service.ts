import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, QueryFailedError, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}
  async create(createWishDto: CreateWishDto, req) {
    const { ...data } = createWishDto;
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException();

    const wish = this.wishRepository.create({ ...data, owner: user });
    try {
      const savedWish = await this.wishRepository.save(wish);
      return await this.wishRepository.findOne({
        where: { id: savedWish.id },
        relations: ['owner', 'offers'],
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          message: 'Дублирующееся значение',
          error,
        });
      }
      throw error;
    }
  }

  findOne(query: FindOneOptions<Wish>) {
    const wish = this.wishRepository.findOne(query);
    if (!wish) throw new NotFoundException();
    return wish;
  }

  async findAll(query: FindManyOptions<Wish>) {
    const wish = await this.wishRepository.find(query);
    if (!wish) throw new NotFoundException();
    return wish;
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne({
      where: { id: id },
      relations: ['owner', 'offers'],
    });
    if (!wish) throw new NotFoundException();
    if (wish?.owner?.id !== userId)
      throw new BadRequestException(
        'Вы не можете редактировать чужие  подарки',
      );
    if (!wish.offers.length && updateWishDto.price !== wish.price) {
      throw new BadRequestException(
        'нельзя изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.findOne({
      where: { id: id },
      relations: ['owner'],
    });
    if (!wish) throw new BadRequestException();
    if (wish.owner.id !== userId)
      throw new BadRequestException('Вы не можете удалять чужие  подарки');
    return this.wishRepository.remove({ ...wish });
  }

  async copy(id: number, req) {
    const originalWish = await this.wishRepository.findOne({
      where: { id: id },
    });

    if (!originalWish) {
      throw new NotFoundException('Желание не найдено');
    }
    try {
      const { id, createdDate, updatedDate, ...rest } = originalWish;
      const copy = await this.create(rest, req);

      originalWish.copied += 1;
      await this.wishRepository.save(originalWish);

      return copy;
    } catch (error) {
      throw new BadRequestException('Ошибка при копировании');
    }
  }
}
