import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'certifications' })
export class Certification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 100 })
  normCode: string;

  @Column('varchar', { length: 200, nullable: true })
  certifyingBody: string | null;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('varchar', { length: 500, nullable: true })
  imageUrl: string | null;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('int', { default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
