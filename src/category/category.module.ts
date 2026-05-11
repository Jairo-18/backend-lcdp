import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryUC } from './useCases/category.UC';
import { CategoryRepository } from '../shared/repositories/category.repository';
import { Category } from '../shared/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryUC, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
