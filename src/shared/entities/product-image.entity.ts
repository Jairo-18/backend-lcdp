import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductPresentation } from './product-presentation.entity';
import { ImageVariant } from '../dtos/image-variant.dto';

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

  @Column('jsonb')
  variants: ImageVariant;

  @Column('int', { default: 0 })
  order: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
