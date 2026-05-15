import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageVariant } from '../dtos/image-variant.dto';

@Entity({ name: 'organizational' })
export class Organizational {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Datos del negocio
  @Column('varchar', { length: 150 })
  name: string;

  @Column('varchar', { length: 150, nullable: true })
  legalName?: string;

  @Column('varchar', { length: 50, nullable: true })
  nit?: string;

  @Column('varchar', { length: 150, nullable: true })
  email?: string;

  @Column('varchar', { length: 25, nullable: true })
  phone?: string;

  @Column('varchar', { length: 25, nullable: true })
  whatsappNumber?: string;

  @Column('varchar', { length: 200, nullable: true })
  website?: string;

  @Column('varchar', { length: 200, nullable: true })
  address?: string;

  @Column('varchar', { length: 100, nullable: true })
  city?: string;

  @Column('varchar', { length: 100, nullable: true })
  department?: string;

  // Branding
  @Column('varchar', { length: 500, nullable: true })
  logoUrl?: string;

  @Column('varchar', { length: 500, nullable: true })
  faviconUrl?: string;

  @Column('varchar', { length: 20, nullable: true })
  primaryColor?: string;

  @Column('varchar', { length: 20, nullable: true })
  secondaryColor?: string;

  @Column('varchar', { length: 20, nullable: true })
  accentColor?: string;

  @Column('varchar', { length: 20, nullable: true })
  bgColor?: string;

  @Column('varchar', { length: 20, nullable: true })
  textColor?: string;

  // Redes sociales
  @Column('varchar', { length: 500, nullable: true })
  facebookUrl?: string;

  @Column('varchar', { length: 500, nullable: true })
  instagramUrl?: string;

  @Column('varchar', { length: 500, nullable: true })
  youtubeUrl?: string;

  @Column('varchar', { length: 500, nullable: true })
  tiktokUrl?: string;

  @Column('varchar', { length: 500, nullable: true })
  mapsUrl?: string;

  // Contenido
  @Column('text', { nullable: true })
  description?: string;

  @Column('varchar', { length: 200, nullable: true })
  aboutTitle?: string;

  @Column('text', { nullable: true })
  aboutDescription?: string;

  @Column('varchar', { length: 200, nullable: true })
  missionTitle?: string;

  @Column('text', { nullable: true })
  missionDescription?: string;

  @Column('varchar', { length: 200, nullable: true })
  visionTitle?: string;

  @Column('text', { nullable: true })
  visionDescription?: string;

  // SEO
  @Column('varchar', { length: 200, nullable: true })
  metaTitle?: string;

  @Column('text', { nullable: true })
  metaDescription?: string;

  @Column('varchar', { length: 500, nullable: true })
  metaKeywords?: string;

  @Column('jsonb', { default: [] })
  bannerImages: ImageVariant[];

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
