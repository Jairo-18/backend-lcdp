import { Injectable } from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { CreateColorDto, ColorQueryDto, UpdateColorDto } from '../dtos/color.dto';

@Injectable()
export class ColorUC {
  constructor(private readonly _colorService: ColorService) {}

  create(dto: CreateColorDto)                { return this._colorService.create(dto); }
  findAll(query: ColorQueryDto)              { return this._colorService.findAll(query); }
  findOne(id: number)                        { return this._colorService.findOne(id); }
  update(id: number, dto: UpdateColorDto)    { return this._colorService.update(id, dto); }
  remove(id: number)                         { return this._colorService.remove(id); }
}
