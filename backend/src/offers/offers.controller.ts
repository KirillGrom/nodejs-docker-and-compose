import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne({
      where: {
        id: +id,
      },
      relations: ['user', 'item'],
    });
  }
  @Get()
  findAll() {
    return this.offersService.findAll({
      relations: ['user', 'item'],
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.removeOne({
      where: {
        id: +id,
      },
    });
  }
}
