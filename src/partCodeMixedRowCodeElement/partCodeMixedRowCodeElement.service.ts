import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PartCodeMixedRowCodeElementDto,
  PartCodeMixedRowElementType,
} from '../tasks/dto/InputFlowPartCode.dto';
import { PartCodeMixedRowCodeElement } from './partCodeMixedRowCodeElement.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { PartCodeMixedRow } from '../partCodeMixedRow/partCodeMixedRow.model';
import { User } from '../users/users.model';

@Injectable()
export class PartCodeMixedRowCodeElementService {
  constructor(
    @InjectModel(PartCodeMixedRowCodeElement)
    private readonly _partCodeMixedRowCodeElementModel: typeof PartCodeMixedRowCodeElement,
    @InjectModel(PartCodeMixedRowCodeElementInput)
    private readonly _partCodeMixedRowCodeElementInputModel: typeof PartCodeMixedRowCodeElementInput,
  ) {}

  async getAllPartCodeMixedRowCodeElementsWithUserInput(params: {
    rowId: PartCodeMixedRow['id'];
    userId: User['id'];
  }): Promise<PartCodeMixedRowCodeElementDto[]> {
    const partCodeMixedRowCodeElements =
      await this._partCodeMixedRowCodeElementModel.findAll({
        where: {
          rowId: params.rowId,
        },
      });

    if (!partCodeMixedRowCodeElements.length) {
      return [];
    }

    const getPartCodeMixedRowCodeElementInputPromises =
      partCodeMixedRowCodeElements.map(
        async (codeElement): Promise<PartCodeMixedRowCodeElementInput | null> =>
          this._partCodeMixedRowCodeElementInputModel.findOne({
            where: {
              userId: params.userId,
              rowElementId: codeElement.id,
            },
          }),
      );

    const partCodeMixedRowCodeElementInput = await Promise.all(
      getPartCodeMixedRowCodeElementInputPromises,
    );

    const partCodeMixedRowCodeElementWithUserInput =
      partCodeMixedRowCodeElements.map<PartCodeMixedRowCodeElementDto>(
        (codeElement) => ({
          id: codeElement.id,
          type: PartCodeMixedRowElementType.code,
          order: codeElement.order,
          symbolsLength: codeElement.symbolsLength,
          value:
            partCodeMixedRowCodeElementInput.find(
              (input) => input && input.rowElementId === codeElement.id,
            )?.value ?? '',
        }),
      );

    return partCodeMixedRowCodeElementWithUserInput;
  }
}
