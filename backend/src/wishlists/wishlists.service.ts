import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { In } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, req) {
    const user = await this.usersService.findById(req.user.userId);
    const wishes = await this.wishService.findAll({
      where: {
        id: In(createWishlistDto.itemsId),
      },
    });
    const wishlists = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return this.wishlistsRepository.save(wishlists);
  }

  async findAll(query: FindManyOptions<Wishlist>) {
    return await this.wishlistsRepository.find(query);
  }

  findOne(query: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  async updateOne(
    query: FindManyOptions<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(query);
    if (!wishlist) throw new NotFoundException();
    if (wishlist.owner.id !== userId)
      throw new BadRequestException(
        'Вы не можете редактировать чужие списки подарков',
      );
    return this.wishlistsRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async remove(query: FindManyOptions<Wishlist>, userId: number) {
    const wishlist = await this.findOne(query);
    if (!wishlist) throw new BadRequestException();
    if (wishlist.owner.id !== userId)
      throw new BadRequestException(
        'Вы не можете удалять чужие списки подарков',
      );
    return this.wishlistsRepository.remove(wishlist);
  }
}
