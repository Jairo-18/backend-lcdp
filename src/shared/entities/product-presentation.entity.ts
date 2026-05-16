import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { UnitOfMeasure } from './unit-of-measure.entity';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'product_presentations' })
export class ProductPresentation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.presentations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  productId: number;

  @ManyToOne(() => UnitOfMeasure, { nullable: false })
  @JoinColumn({ name: 'unitOfMeasureId' })
  unitOfMeasure: UnitOfMeasure;

  @Column('int')
  unitOfMeasureId: number;

  @Column('varchar', { length: 100, nullable: true })
  sku: string;

  @OneToMany(() => ProductImage, (image) => image.presentation, {
    cascade: true,
  })
  images: ProductImage[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
