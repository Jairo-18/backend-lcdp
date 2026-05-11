import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UnitOfMeasure } from '../../shared/entities/unit-of-measure.entity';
import { UnitOfMeasureRepository } from '../../shared/repositories/unit-of-measure.repository';
import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '../dtos/unit-of-measure.dto';

@Injectable()
export class UnitOfMeasureService {
  constructor(private readonly _repo: UnitOfMeasureRepository) {}

  async create(dto: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe una unidad con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(): Promise<UnitOfMeasure[]> {
    return this._repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<UnitOfMeasure> {
    const unit = await this._repo.findOne({ where: { id } });
    if (!unit) throw new NotFoundException('Unidad de medida no encontrada');
    return unit;
  }

  async update(id: string, dto: UpdateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    const unit = await this.findOne(id);
    if (dto.code && dto.code !== unit.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe una unidad con el código "${dto.code}"`);
    }
    Object.assign(unit, dto);
    return this._repo.save(unit);
  }

  async remove(id: string): Promise<void> {
    const unit = await this.findOne(id);
    await this._repo.remove(unit);
  }
}
