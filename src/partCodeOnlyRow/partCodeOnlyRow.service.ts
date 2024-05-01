import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartCodeOnlyRow } from './partCodeOnlyRow.model';
import { PartCodeOnlyRowInput } from '../partCodeOnlyRowInput/partCodeOnlyRowInput.model';
import { User } from '../users/users.model';
import { InputFlowPartCode } from '../inputFlowPartCode/inputFlowPartCode.model';
import {
  PartCodeOnlyRowDto,
  PartCodeRowType,
} from '../tasks/dto/InputFlowPartCode.dto';

@Injectable()
export class PartCodeOnlyRowService {
  constructor(
    @InjectModel(PartCodeOnlyRow)
    private readonly _partCodeOnlyRowModel: typeof PartCodeOnlyRow,
    @InjectModel(PartCodeOnlyRowInput)
    private readonly _partCodeOnlyRowInputModel: typeof PartCodeOnlyRowInput,
  ) {}

  async getAllPartCodeOnlyRowsWithUserInput(params: {
    inputFlowPartCodeId: InputFlowPartCode['id'];
    userId: User['id'];
  }): Promise<PartCodeOnlyRowDto[]> {
    const partCodeOnlyRows = await this._partCodeOnlyRowModel.findAll({
      where: { inputFlowId: params.inputFlowPartCodeId },
    });

    if (!partCodeOnlyRows.length) {
      return [];
    }

    const getPartCodeOnlyRowInputPromises = partCodeOnlyRows.map(
      async (partCodeOnlyRow): Promise<PartCodeOnlyRowInput | null> =>
        this._partCodeOnlyRowInputModel.findOne({
          where: {
            userId: params.userId,
            rowId: partCodeOnlyRow.id,
          },
        }),
    );

    const partCodeOnlyRowInputs = await Promise.all(
      getPartCodeOnlyRowInputPromises,
    );

    const inputFlowOnlyCodeWithUserInput =
      partCodeOnlyRows.map<PartCodeOnlyRowDto>((partCodeOnlyRow) => ({
        id: partCodeOnlyRow.id,
        tabs: partCodeOnlyRow.tabs,
        type: PartCodeRowType.code,
        order: partCodeOnlyRow.order,
        linesCount: partCodeOnlyRow.linesHeight,
        value:
          partCodeOnlyRowInputs.find(
            (input) => input && input.rowId === partCodeOnlyRow.id,
          )?.value ?? '',
      }));

    return inputFlowOnlyCodeWithUserInput;
  }
}
