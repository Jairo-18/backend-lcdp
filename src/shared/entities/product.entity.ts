import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductPresentation } from './product-presentation.entity';
import { TaxType } from './tax-type.entity';
import { Color } from './color.entity';

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

  @ManyToMany(() => Category, { eager: false })
  @JoinTable({
    name: 'product_categories',
    joinColumn:        { name: 'productId',  referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Color, { eager: false })
  @JoinTable({
    name: 'product_colors',
    joinColumn:        { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'colorId',   referencedColumnName: 'id' },
  })
  colors: Color[];

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

  @Column('boolean', { default: false })
  isPromotion: boolean;

  @Column('varchar', { length: 500, nullable: true })
  technicalSheet: string;

  @Column('varchar', { length: 500, nullable: true })
  safetySheet: string;

  @Column('text', { nullable: true })
  modeOfUse: string;

  @Column('varchar', { length: 300, nullable: true })
  performance: string;

  @Column('text', { nullable: true })
  benefits: string;

  @Column('varchar', { length: 500, nullable: true })
  videoUrl: string;

  @Column('int', { nullable: true })
  markupPercentage: number | null;

  @Column('int', { nullable: true })
  discountPercentage: number | null;

  @OneToMany(() => ProductPresentation, (presentation) => presentation.product, {
    cascade: true,
  })
  presentations: ProductPresentation[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
