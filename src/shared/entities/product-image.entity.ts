import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductPresentation } from './product-presentation.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductPresentation, (presentation) => presentation.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'presentationId' })
  presentation: ProductPresentation;

  @Column('int')
  presentationId: number;

  @Column('varchar', { length: 500 })
  url: string;

  @Column('int', { default: 0 })
  order: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
