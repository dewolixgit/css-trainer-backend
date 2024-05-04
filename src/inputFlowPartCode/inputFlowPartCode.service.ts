import { Injectable } from '@nestjs/common';
import { PartCodeMixedRowService } from '../partCodeMixedRow/partCodeMixedRow.service';
import { PartCodeOnlyRowService } from '../partCodeOnlyRow/partCodeOnlyRow.service';
import { InjectModel } from '@nestjs/sequelize';
import { InputFlowPartCode } from './inputFlowPartCode.model';
import { User } from '../users/users.model';
import { InputFlowPartCodeDto } from '../tasks/dto/InputFlowPartCode.dto';
import {
  ContentFlowBlockType,
  InputFlowBlockType,
} from '../tasks/dto/contentFlowBlock';
import { Task } from '../tasks/tasks.model';
import { filterBoolean } from '../lib/filterBoolean';

@Injectable()
export class InputFlowPartCodeService {
  constructor(
    private readonly _partCodeMixedRowService: PartCodeMixedRowService,
    private readonly _partCodeOnlyRowService: PartCodeOnlyRowService,
    @InjectModel(InputFlowPartCode)
    private readonly _inputFlowPartCodeModel: typeof InputFlowPartCode,
  ) {}

  async getInputFlowPartCodeByPkWithUserInputOrdered(params: {
    inputFlowPartCodeId: InputFlowPartCode['id'];
    userId: User['id'] | null;
  }): Promise<InputFlowPartCodeDto | null> {
    const inputFlowPartCode = await this._inputFlowPartCodeModel.findByPk(
      params.inputFlowPartCodeId,
    );

    if (!inputFlowPartCode) {
      return null;
    }

    const getRowsPromises = [
      this._partCodeMixedRowService.getAllPartCodeMixedRowsWithUserInput({
        inputFlowPartCodeId: params.inputFlowPartCodeId,
        userId: params.userId,
      }),
      this._partCodeOnlyRowService.getAllPartCodeOnlyRowsWithUserInput({
        inputFlowPartCodeId: params.inputFlowPartCodeId,
        userId: params.userId,
      }),
    ];

    const [partCodeMixedRows, partCodeOnlyRows] =
      await Promise.all(getRowsPromises);

    const orderedRows = [...partCodeMixedRows, ...partCodeOnlyRows].sort(
      (row1, row2) => row1.order - row2.order,
    );

    return {
      id: inputFlowPartCode.id,
      inputType: InputFlowBlockType.partText,
      contentType: ContentFlowBlockType.input,
      order: inputFlowPartCode.order,
      rows: orderedRows,
    };
  }

  async getAllInputFlowPartCodeWithUserInput(params: {
    taskId: Task['id'];
    userId: User['id'] | null;
  }): Promise<InputFlowPartCodeDto[]> {
    const inputFlowPartCodes = await this._inputFlowPartCodeModel.findAll({
      where: { taskId: params.taskId },
    });

    if (!inputFlowPartCodes.length) {
      return [];
    }

    const getAllInputFlowPartCodePromises = inputFlowPartCodes.map(
      async (inputFlowPartCode) =>
        this.getInputFlowPartCodeByPkWithUserInputOrdered({
          inputFlowPartCodeId: inputFlowPartCode.id,
          userId: params.userId,
        }),
    );

    const allInputFlowPartCodes = await Promise.all(
      getAllInputFlowPartCodePromises,
    );

    return filterBoolean(allInputFlowPartCodes);
  }
}
