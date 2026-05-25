import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ColorController } from './controllers/color.controller';
import { ColorService } from './services/color.service';
import { ColorUC } from './useCases/color.UC';
import { ColorRepository } from '../shared/repositories/color.repository';
import { Color } from '../shared/entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Color]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ColorController],
  providers: [ColorService, ColorUC, ColorRepository],
  exports: [ColorService, ColorRepository],
})
export class ColorModule {}
