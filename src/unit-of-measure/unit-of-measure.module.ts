import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UnitOfMeasureController } from './controllers/unit-of-measure.controller';
import { UnitOfMeasureService } from './services/unit-of-measure.service';
import { UnitOfMeasureUC } from './useCases/unit-of-measure.UC';
import { UnitOfMeasureRepository } from '../shared/repositories/unit-of-measure.repository';
import { UnitOfMeasure } from '../shared/entities/unit-of-measure.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitOfMeasure]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UnitOfMeasureController],
  providers: [UnitOfMeasureService, UnitOfMeasureUC, UnitOfMeasureRepository],
  exports: [UnitOfMeasureService],
})
export class UnitOfMeasureModule {}
