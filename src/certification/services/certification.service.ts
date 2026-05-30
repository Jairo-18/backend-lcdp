import { Injectable, NotFoundException } from '@nestjs/common';
import { Certification } from '../../shared/entities/certification.entity';
import { CertificationRepository } from '../../shared/repositories/certification.repository';
import { CreateCertificationDto, CertificationQueryDto, UpdateCertificationDto } from '../dtos/certification.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';

@Injectable()
export class CertificationService {
  constructor(private readonly _repo: CertificationRepository) {}

  async create(dto: CreateCertificationDto): Promise<Certification> {
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: CertificationQueryDto): Promise<ResponsePaginationDto<Certification>> {
    const page    = query.page    ?? 1;
    const perPage = query.perPage ?? 20;
    const skip    = (page - 1) * perPage;

    const qb = this._repo
      .createQueryBuilder('cert')
      .orderBy('cert.sortOrder', 'ASC')
      .addOrderBy('cert.name', 'ASC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere(
        '(LOWER(cert.name) LIKE LOWER(:s) OR LOWER(cert.normCode) LIKE LOWER(:s))',
        { s: `%${query.search}%` },
      );
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findAllActive(): Promise<Certification[]> {
    return this._repo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Certification> {
    const cert = await this._repo.findOne({ where: { id } });
    if (!cert) throw new NotFoundException('Certificación no encontrada');
    return cert;
  }

  async update(id: number, dto: UpdateCertificationDto): Promise<Certification> {
    const cert = await this.findOne(id);
    Object.assign(cert, dto);
    return this._repo.save(cert);
  }

  async remove(id: number): Promise<void> {
    const cert = await this.findOne(id);
    await this._repo.remove(cert);
  }
}
