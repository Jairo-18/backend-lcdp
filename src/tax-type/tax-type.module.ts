import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { TaxTypeController } from './controllers/tax-type.controller';
import { TaxTypeService } from './services/tax-type.service';
import { TaxTypeUC } from './useCases/tax-type.UC';
import { TaxTypeRepository } from '../shared/repositories/tax-type.repository';
import { TaxType } from '../shared/entities/tax-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaxType]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TaxTypeController],
  providers: [TaxTypeService, TaxTypeUC, TaxTypeRepository],
  exports: [TaxTypeService],
})
export class TaxTypeModule {}
