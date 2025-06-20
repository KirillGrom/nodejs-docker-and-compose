import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, nullable: false, default: '' })
  @Length(2, 250)
  name: string;

  @Column({ length: 1024, nullable: false, default: '' })
  @Length(1, 1024)
  description: string;

  @Column({ nullable: true, default: '' })
  image: string;

  @ManyToMany(() => Wish, (item) => item)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user: User) => user.wishlists)
  owner: User;

  @CreateDateColumn({ type: 'timestamp', default: new Date() })
  createdDate: Date;
  @UpdateDateColumn({ type: 'timestamp', default: new Date() })
  updatedDate: Date;
}
