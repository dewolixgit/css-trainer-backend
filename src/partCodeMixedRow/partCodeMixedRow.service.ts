import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartCodeMixedRow } from './partCodeMixedRow.model';
import {
  PartCodeMixedRowDto,
  PartCodeRowType,
} from '../tasks/dto/InputFlowPartCode.dto';
import { User } from '../users/users.model';
import { PartCodeMixedRowCodeElementService } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.service';
import { PartCodeMixedRowTextElementService } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.service';
import { InputFlowPartCode } from '../inputFlowPartCode/inputFlowPartCode.model';
import { filterBoolean } from '../lib/filterBoolean';

@Injectable()
export class PartCodeMixedRowService {
  constructor(
    private readonly _partCodeMixedRowCodeElement: PartCodeMixedRowCodeElementService,
    private readonly _partCodeMixedRowTextElement: PartCodeMixedRowTextElementService,
    @InjectModel(PartCodeMixedRow)
    private readonly _partCodeMixedRowModel: typeof PartCodeMixedRow,
  ) {}

  async getMixedRowByPkWithUserInputOrdered(params: {
    rowId: PartCodeMixedRow['id'];
    userId: User['id'] | null;
  }): Promise<PartCodeMixedRowDto | null> {
    const row = await this._partCodeMixedRowModel.findByPk(params.rowId);

    if (!row) {
      return null;
    }

    const getElementsPromises = [
      this._partCodeMixedRowTextElement.getAllPartCodeMixedTextElement({
        rowId: params.rowId,
      }),
      this._partCodeMixedRowCodeElement.getAllPartCodeMixedRowCodeElementsWithUserInput(
        { rowId: params.rowId, userId: params.userId },
      ),
    ];

    const [textElements, codeElements] = await Promise.all(getElementsPromises);

    const orderedElements = [...textElements, ...codeElements].sort(
      (element1, element2) => element1.order - element2.order,
    );

    return {
      id: row.id,
      tabs: row.tabs,
      order: row.order,
      elements: orderedElements,
      type: PartCodeRowType.mixed,
    };
  }

  async getAllPartCodeMixedRowsWithUserInput(params: {
    userId: User['id'] | null;
    inputFlowPartCodeId: InputFlowPartCode['id'];
  }): Promise<PartCodeMixedRowDto[]> {
    const allRows = await this._partCodeMixedRowModel.findAll({
      where: {
        inputFlowId: params.inputFlowPartCodeId,
      },
    });

    if (!allRows.length) {
      return [];
    }

    const getAllMixedRowsPromises = allRows.map((row) =>
      this.getMixedRowByPkWithUserInputOrdered({
        rowId: row.id,
        userId: params.userId,
      }),
    );

    const allMixedRows = await Promise.all(getAllMixedRowsPromises);

    return filterBoolean(allMixedRows);
  }
}
