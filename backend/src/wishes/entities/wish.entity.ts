import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 250, nullable: false, default: '' })
  @Length(2, 250)
  name: string;

  @Column({ length: 250, nullable: false, default: '' })
  @IsUrl()
  image: string;

  @Column({ nullable: true, default: '' })
  @IsUrl()
  link: string;

  @Column({ nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user: User) => user.wishes)
  owner: User;

  @ManyToMany(() => Wishlist, (wishlist: Wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @Column({ length: 1024, nullable: false, default: '' })
  @Length(1, 1024)
  description: string;

  @Column({ nullable: true, default: 0 })
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @CreateDateColumn({ type: 'timestamp', default: new Date() })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp', default: new Date() })
  updatedDate: Date;
}
