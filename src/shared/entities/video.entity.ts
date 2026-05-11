import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  title: string;

  @Column('varchar', { length: 500 })
  url: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50, nullable: true })
  youtubeId: string;

  @Column('varchar', { length: 500, nullable: true })
  thumbnailUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
