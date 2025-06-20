import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,

    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId: number) {
    return this.wishRepository.manager.transaction(async (em) => {
      const user = await em.findOne(User, { where: { id: userId } });
      const wish = await em.findOne(Wish, {
        where: { id: createOfferDto?.itemId },
        relations: ['owner'],
      });
      if (wish.owner.id === userId) {
        throw new BadRequestException({
          message: `Нельзя вносить суммы на свои подарки`,
        });
      }
      if (wish.raised + createOfferDto.amount > wish.price) {
        throw new BadRequestException({
          message: `Сумма заявки больше чем осталось собрать`,
          raised: wish.raised,
          price: wish.price,
        });
      }

      const newOffer = em.create(Offer, {
        ...createOfferDto,
        item: wish,
        user: user,
      });

      await em.save(newOffer);

      wish.raised += newOffer.amount;
      await em.save(wish);

      return newOffer;
    });
  }

  async findAll(query: FindManyOptions<Offer>) {
    return await this.offerRepository.find(query);
  }

  async updateOne(query: FindManyOptions<Offer>) {
    return await this.offerRepository.find(query);
  }

  async removeOne(query: FindManyOptions<Offer>) {
    return await this.offerRepository.find(query);
  }

  async findOne(query: FindManyOptions<Offer>) {
    return await this.offerRepository.find(query);
  }
}
