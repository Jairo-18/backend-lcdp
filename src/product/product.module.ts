import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ProductController } from './controllers/product.controller';
import { PublicProductController } from './controllers/public-product.controller';
import { ProductService } from './services/product.service';
import { ProductUC } from './useCases/product.UC';
import { ProductRepository } from '../shared/repositories/product.repository';
import { ProductPresentationRepository } from '../shared/repositories/product-presentation.repository';
import { Product } from '../shared/entities/product.entity';
import { ProductPresentation } from '../shared/entities/product-presentation.entity';
import { ProductImage } from '../shared/entities/product-image.entity';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductPresentation, ProductImage]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProductController, PublicProductController],
  providers: [ProductService, ProductUC, ProductRepository, ProductPresentationRepository, UploadService],
  exports: [ProductService],
})
export class ProductModule {}
