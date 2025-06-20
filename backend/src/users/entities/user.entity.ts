import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  @Length(1, 64)
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsUrl({ require_protocol: true })
  @IsOptional()
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar?: string;

  @Column({ unique: true, length: 255, nullable: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Exclude({})
  @IsString()
  password: string;

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @CreateDateColumn({ default: new Date() })
  createdDate: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedDate: Date;
}
