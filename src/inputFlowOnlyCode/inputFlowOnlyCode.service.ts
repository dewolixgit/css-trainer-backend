import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InputFlowOnlyCode } from './inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { Task } from '../tasks/tasks.model';
import { User } from '../users/users.model';
import { InputFlowOnlyCodeDto } from '../tasks/dto/InputFlowOnlyCode.dto';
import {
  ContentFlowBlockType,
  InputFlowBlockType,
} from '../tasks/dto/contentFlowBlock';
import { UserInputTypeEnum } from '../tasks/dto/SaveUserInputPayload.dto';
import { ServicePromiseHttpResponse } from '../types/ServiceResponse';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class InputFlowOnlyCodeService {
  constructor(
    @InjectModel(InputFlowOnlyCode)
    private readonly _inputFlowOnlyCodeModel: typeof InputFlowOnlyCode,
    @InjectModel(InputFlowOnlyCodeInput)
    private readonly _inputFlowOnlyCodeInputModel: typeof InputFlowOnlyCodeInput,
  ) {}

  private _toInputFlowOnlyCodeDto(params: {
    inputFlowOnlyCode: InputFlowOnlyCode;
    value?: string;
  }): InputFlowOnlyCodeDto {
    return {
      id: params.inputFlowOnlyCode.id,
      contentType: ContentFlowBlockType.input,
      inputType: InputFlowBlockType.textArea,
      order: params.inputFlowOnlyCode.order,
      linesCount: params.inputFlowOnlyCode.linesHeight,
      value: params.value ?? '',
    };
  }

  async getAllInputFlowOnlyCodeBlocksWithUserInput(params: {
    taskId: Task['id'];
    userId: User['id'] | null;
  }): Promise<InputFlowOnlyCodeDto[]> {
    const inputFlowOnlyCodeBlocks = await this._inputFlowOnlyCodeModel.findAll({
      where: { taskId: params.taskId },
    });

    if (!inputFlowOnlyCodeBlocks.length) {
      return [];
    }

    const userId = params.userId;

    if (!userId) {
      return inputFlowOnlyCodeBlocks.map((inputFlowOnlyCode) =>
        this._toInputFlowOnlyCodeDto({ inputFlowOnlyCode }),
      );
    }

    const getInputFlowOnlyCodeInputPromises = inputFlowOnlyCodeBlocks.map(
      async (flowOnlyCodeBlock): Promise<InputFlowOnlyCodeInput | null> =>
        this._inputFlowOnlyCodeInputModel.findOne({
          where: {
            userId,
            inputFlowId: flowOnlyCodeBlock.id,
          },
        }),
    );

    const inputFlowOnlyCodeInput = await Promise.all(
      getInputFlowOnlyCodeInputPromises,
    );

    return inputFlowOnlyCodeBlocks.map((inputFlowOnlyCode) =>
      this._toInputFlowOnlyCodeDto({
        inputFlowOnlyCode,
        value:
          inputFlowOnlyCodeInput.find(
            (input) => input && input.inputFlowId === inputFlowOnlyCode.id,
          )?.value ?? '',
      }),
    );
  }

  async getByPrimaryKey(
    inputFlowId: InputFlowOnlyCode['id'],
  ): Promise<InputFlowOnlyCode | null> {
    return await this._inputFlowOnlyCodeModel.findByPk(inputFlowId);
  }

  /**
   * @return false if error, true if success
   */
  async saveInput(params: {
    inputFlowId: InputFlowOnlyCode['id'];
    userId: User['id'];
    value: string;
  }): Promise<boolean> {
    const input = await this._inputFlowOnlyCodeInputModel.findOne({
      where: {
        userId: params.userId,
        inputFlowId: params.inputFlowId,
      },
    });

    if (!input) {
      const created = await this._inputFlowOnlyCodeInputModel.create({
        userId: params.userId,
        inputFlowId: params.inputFlowId,
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
    inputFlowId: InputFlowOnlyCode['id'];
    userId: User['id'];
    value: string;
  }): ServicePromiseHttpResponse {
    const input = await this.getByPrimaryKey(params.inputFlowId);

    if (!input) {
      return {
        isError: true,
        data: {
          code: HttpStatus.NOT_FOUND,
          message: `Input with id ${params.inputFlowId} not found`,
        },
      };
    }

    const result = await this.saveInput({
      userId: params.userId,
      inputFlowId: params.inputFlowId,
      value: params.value ?? '',
    });

    if (!result) {
      return {
        isError: true,
        data: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error saving input with id ${params.inputFlowId}, type ${UserInputTypeEnum.partCodeOnlyRow}`,
        },
      };
    }

    return {
      isError: false,
    };
  }
}
