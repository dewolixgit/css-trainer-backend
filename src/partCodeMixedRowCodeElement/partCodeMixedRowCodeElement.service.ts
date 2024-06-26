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
import { ServicePromiseHttpResponse } from '../types/ServiceResponse';
import { HttpStatus } from '@nestjs/common/enums';
import { UserInputTypeEnum } from '../tasks/dto/SaveUserInputPayload.dto';

@Injectable()
export class PartCodeMixedRowCodeElementService {
  constructor(
    @InjectModel(PartCodeMixedRowCodeElement)
    private readonly _partCodeMixedRowCodeElementModel: typeof PartCodeMixedRowCodeElement,
    @InjectModel(PartCodeMixedRowCodeElementInput)
    private readonly _partCodeMixedRowCodeElementInputModel: typeof PartCodeMixedRowCodeElementInput,
  ) {}

  private _toPartCodeMixedRowCodeElementDto(params: {
    partCodeMixedRowCodeElement: PartCodeMixedRowCodeElement;
    value?: string;
  }): PartCodeMixedRowCodeElementDto {
    return {
      id: params.partCodeMixedRowCodeElement.id,
      type: PartCodeMixedRowElementType.code,
      order: params.partCodeMixedRowCodeElement.order,
      symbolsLength: params.partCodeMixedRowCodeElement.symbolsLength,
      value: params.value ?? '',
    };
  }

  async getAllPartCodeMixedRowCodeElementsWithUserInput(params: {
    rowId: PartCodeMixedRow['id'];
    userId: User['id'] | null;
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

    const userId = params.userId;

    if (!userId) {
      return partCodeMixedRowCodeElements.map((partCodeMixedRowCodeElement) =>
        this._toPartCodeMixedRowCodeElementDto({
          partCodeMixedRowCodeElement,
        }),
      );
    }

    const getPartCodeMixedRowCodeElementInputPromises =
      partCodeMixedRowCodeElements.map(
        async (codeElement): Promise<PartCodeMixedRowCodeElementInput | null> =>
          this._partCodeMixedRowCodeElementInputModel.findOne({
            where: {
              userId,
              rowElementId: codeElement.id,
            },
          }),
      );

    const partCodeMixedRowCodeElementInput = await Promise.all(
      getPartCodeMixedRowCodeElementInputPromises,
    );

    return partCodeMixedRowCodeElements.map((partCodeMixedRowCodeElement) =>
      this._toPartCodeMixedRowCodeElementDto({
        partCodeMixedRowCodeElement,
        value:
          partCodeMixedRowCodeElementInput.find(
            (input) =>
              input && input.rowElementId === partCodeMixedRowCodeElement.id,
          )?.value ?? '',
      }),
    );
  }

  async getByPrimaryKey(
    rowElementId: PartCodeMixedRowCodeElement['id'],
  ): Promise<PartCodeMixedRowCodeElement | null> {
    return await this._partCodeMixedRowCodeElementModel.findByPk(rowElementId);
  }

  /**
   * @return false if error, true if success
   */
  async saveInput(params: {
    rowElementId: PartCodeMixedRowCodeElement['id'];
    userId: User['id'];
    value: string;
  }): Promise<boolean> {
    const input = await this._partCodeMixedRowCodeElementInputModel.findOne({
      where: {
        userId: params.userId,
        rowElementId: params.rowElementId,
      },
    });

    if (!input) {
      const created = await this._partCodeMixedRowCodeElementInputModel.create({
        userId: params.userId,
        rowElementId: params.rowElementId,
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
    rowElementId: PartCodeMixedRowCodeElement['id'];
    userId: User['id'];
    value: string;
  }): ServicePromiseHttpResponse {
    const input = await this.getByPrimaryKey(params.rowElementId);

    if (!input) {
      return {
        isError: true,
        data: {
          code: HttpStatus.NOT_FOUND,
          message: `Input with id ${params.rowElementId} not found`,
        },
      };
    }

    const result = await this.saveInput({
      userId: params.userId,
      rowElementId: params.rowElementId,
      value: params.value ?? '',
    });

    if (!result) {
      return {
        isError: true,
        data: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error saving input with id ${params.rowElementId}, type ${UserInputTypeEnum.partCodeMixedRowCodeElement}`,
        },
      };
    }

    return {
      isError: false,
    };
  }
}
