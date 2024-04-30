import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartCodeMixedRowTextElement } from './partCodeMixedRowTextElement.model';
import {
  PartCodeMixedRowElementType,
  PartCodeMixedRowTextElementDto,
} from '../tasks/dto/InputFlowPartCode.dto';

@Injectable()
export class PartCodeMixedRowTextElementService {
  constructor(
    @InjectModel(PartCodeMixedRowTextElement)
    private readonly _partCodeMixedRowTextElementModel: typeof PartCodeMixedRowTextElement,
  ) {}

  async getAllPartCodeMixedTextElement(params: {
    rowId: number;
  }): Promise<PartCodeMixedRowTextElementDto[]> {
    const rowElements = await this._partCodeMixedRowTextElementModel.findAll({
      where: {
        rowId: params.rowId,
      },
    });

    return rowElements.map<PartCodeMixedRowTextElementDto>((rowElement) => ({
      id: rowElement.id,
      type: PartCodeMixedRowElementType.text,
      order: rowElement.order,
      text: rowElement.text,
    }));
  }
}
