import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { OrganizationalController } from './controllers/organizational.controller';
import { OrganizationalService } from './services/organizational.service';
import { OrganizationalUC } from './useCases/organizational.UC';
import { OrganizationalRepository } from '../shared/repositories/organizational.repository';
import { Organizational } from '../shared/entities/organizational.entity';
import { Category } from '../shared/entities/category.entity';
import { UnitOfMeasure } from '../shared/entities/unit-of-measure.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizational, Category, UnitOfMeasure]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrganizationalController],
  providers: [OrganizationalService, OrganizationalUC, OrganizationalRepository],
  exports: [OrganizationalService],
})
export class OrganizationalModule {}
