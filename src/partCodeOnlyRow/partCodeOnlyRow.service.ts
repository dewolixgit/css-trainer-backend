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
import { ServicePromiseHttpResponse } from '../types/ServiceResponse';
import { HttpStatus } from '@nestjs/common/enums';
import { UserInputTypeEnum } from '../tasks/dto/SaveUserInputPayload.dto';

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

  async getByPrimaryKey(
    rowId: PartCodeOnlyRow['id'],
  ): Promise<PartCodeOnlyRow | null> {
    return await this._partCodeOnlyRowModel.findByPk(rowId);
  }

  /**
   * @return false if error, true if success
   */
  async saveInput(params: {
    rowId: PartCodeOnlyRow['id'];
    userId: User['id'];
    value: string;
  }): Promise<boolean> {
    const input = await this._partCodeOnlyRowInputModel.findOne({
      where: {
        userId: params.userId,
        rowId: params.rowId,
      },
    });

    if (!input) {
      const created = await this._partCodeOnlyRowInputModel.create({
        userId: params.userId,
        rowId: params.rowId,
        value: params.value,
      });

      return !!created;
    }

    await input.update({
      value: params.value,
    });

    return true;
  }

  async saveInputIfExists(params: {
    rowId: PartCodeOnlyRow['id'];
    userId: User['id'];
    value: string;
  }): ServicePromiseHttpResponse {
    const input = await this.getByPrimaryKey(params.rowId);

    if (!input) {
      return {
        isError: true,
        data: {
          code: HttpStatus.NOT_FOUND,
          message: `Input with id ${params.rowId} not found`,
        },
      };
    }

    const result = await this.saveInput({
      userId: params.userId,
      rowId: params.rowId,
      value: params.value ?? '',
    });

    if (!result) {
      return {
        isError: true,
        data: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error saving input with id ${params.rowId}, type ${UserInputTypeEnum.partCodeOnlyRow}`,
        },
      };
    }

    return {
      isError: false,
    };
  }
}
