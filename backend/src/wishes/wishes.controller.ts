import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: Omit<CreateWishDto, 'ownerId'>, @Req() req) {
    return this.wishesService.create(createWishDto, req);
  }

  @Get('top')
  top() {
    return this.wishesService.findAll({
      take: 20,
      relations: ['owner', 'offers'],
      order: { copied: 'DESC' },
    });
  }
  @Get('last')
  last() {
    return this.wishesService.findAll({
      take: 40,
      relations: ['owner', 'offers'],
      order: { createdDate: 'DESC' },
    });
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne({
      where: {
        id: +id,
      },
      relations: ['owner', 'offers'],
    });
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, req.user.userId);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.removeOne(+id, req.user.userId);
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() req) {
    return this.wishesService.copy(+id, req);
  }
}
