import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Organizational } from '../../shared/entities/organizational.entity';
import { OrganizationalRepository } from '../../shared/repositories/organizational.repository';
import { CreateOrganizationalDto, UpdateOrganizationalDto } from '../dtos/organizational.dto';

@Injectable()
export class OrganizationalService {
  constructor(private readonly _repo: OrganizationalRepository) {}

  async create(dto: CreateOrganizationalDto): Promise<Organizational> {
    const existing = await this._repo.findOne({ where: {} });
    if (existing) {
      throw new ConflictException('Ya existe un registro organizacional. Use el endpoint de actualización.');
    }
    const org = this._repo.create({ ...dto, status: true });
    return this._repo.save(org);
  }

  async findOne(): Promise<Organizational> {
    const org = await this._repo.findOne({ where: {} });
    if (!org) throw new NotFoundException('Registro organizacional no encontrado');
    return org;
  }

  async update(id: string, dto: UpdateOrganizationalDto): Promise<Organizational> {
    const org = await this._repo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Registro organizacional no encontrado');
    Object.assign(org, dto);
    return this._repo.save(org);
  }
}
