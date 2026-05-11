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

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('uuid')
  categoryId: string;

  @ManyToOne(() => Brand, { nullable: false })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column('uuid')
  brandId: string;

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
