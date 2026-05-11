import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { BrandController } from './controllers/brand.controller';
import { BrandService } from './services/brand.service';
import { BrandUC } from './useCases/brand.UC';
import { BrandRepository } from '../shared/repositories/brand.repository';
import { Brand } from '../shared/entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandUC, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
