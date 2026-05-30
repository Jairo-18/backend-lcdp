import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipApiKey } from '../../shared/decorators/skip-api-key.decorator';
import { CertificationUC } from '../useCases/certification.UC';
import { Certification } from '../../shared/entities/certification.entity';

@ApiTags('Public – Certifications')
@SkipApiKey()
@Controller('public/certifications')
export class PublicCertificationController {
  constructor(private readonly _uc: CertificationUC) {}

  @Get()
  @ApiOperation({ summary: 'Listar certificaciones activas (sin auth)' })
  async findAllActive(): Promise<{ statusCode: number; data: Certification[] }> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAllActive() };
  }
}
