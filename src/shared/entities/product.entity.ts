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
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductPresentation } from './product-presentation.entity';
import { TaxType } from './tax-type.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  code: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('int')
  categoryId: number;

  @ManyToOne(() => Brand, { nullable: false })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column('int')
  brandId: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  priceSale: number;

  @ManyToOne(() => TaxType, { nullable: true })
  @JoinColumn({ name: 'taxTypeId' })
  taxType: TaxType;

  @Column('int', { nullable: true })
  taxTypeId: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  technicalSheet: Record<string, string | number | boolean>;

  @Column('varchar', { length: 500, nullable: true })
  videoUrl: string;

  @OneToMany(() => ProductPresentation, (presentation) => presentation.product, {
    cascade: true,
  })
  presentations: ProductPresentation[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
