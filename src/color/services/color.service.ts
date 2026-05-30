import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Color } from '../../shared/entities/color.entity';
import { ColorRepository } from '../../shared/repositories/color.repository';
import { CreateColorDto, ColorQueryDto, UpdateColorDto } from '../dtos/color.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { ProductRepository } from '../../shared/repositories/product.repository';

@Injectable()
export class ColorService {
  constructor(
    private readonly _repo: ColorRepository,
    private readonly _productRepo: ProductRepository,
  ) {}

  async create(dto: CreateColorDto): Promise<Color> {
    if (dto.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe un color con el código "${dto.code}"`);
    }
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: ColorQueryDto): Promise<ResponsePaginationDto<Color>> {
    const page    = query.page    ?? 1;
    const perPage = query.perPage ?? 25;
    const skip    = (page - 1) * perPage;

    const qb = this._repo
      .createQueryBuilder('color')
      .orderBy('color.colorFamily', 'ASC')
      .addOrderBy('color.name', 'ASC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere(
        '(LOWER(color.name) LIKE LOWER(:s) OR LOWER(color.colorFamily) LIKE LOWER(:s) OR LOWER(color.code) LIKE LOWER(:s))',
        { s: `%${query.search}%` },
      );
    }

    if (query.colorFamily) {
      qb.andWhere('LOWER(color.colorFamily) = LOWER(:cf)', { cf: query.colorFamily });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findOne(id: number): Promise<Color> {
    const color = await this._repo.findOne({ where: { id } });
    if (!color) throw new NotFoundException('Color no encontrado');
    return color;
  }

  async update(id: number, dto: UpdateColorDto): Promise<void> {
    const color = await this.findOne(id);
    if (dto.code && dto.code !== color.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe un color con el código "${dto.code}"`);
    }
    if (dto.isActive === false && color.isActive) {
      const count = await this._productRepo
        .createQueryBuilder('product')
        .innerJoin('product.colors', 'color', 'color.id = :id', { id })
        .getCount();
      if (count > 0)
        throw new ConflictException(`No puedes desactivar este color porque está en uso en ${count} producto(s)`);
    }
    Object.assign(color, dto);
    await this._repo.save(color);
  }

  async remove(id: number): Promise<void> {
    const color = await this.findOne(id);
    await this._repo.remove(color);
  }
}
