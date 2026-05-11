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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.presentations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('uuid')
  productId: string;

  @ManyToOne(() => UnitOfMeasure, { nullable: false })
  @JoinColumn({ name: 'unitOfMeasureId' })
  unitOfMeasure: UnitOfMeasure;

  @Column('uuid')
  unitOfMeasureId: string;

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
