import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Certification } from '../shared/entities/certification.entity';
import { CertificationRepository } from '../shared/repositories/certification.repository';
import { CertificationService } from './services/certification.service';
import { CertificationUC } from './useCases/certification.UC';
import { CertificationController } from './controllers/certification.controller';
import { PublicCertificationController } from './controllers/public-certification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certification]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CertificationController, PublicCertificationController],
  providers: [CertificationService, CertificationUC, CertificationRepository],
})
export class CertificationModule {}
