import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InputFlowDnd } from './inputFlowDnd.model';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';
import { User } from '../users/users.model';
import { InputFlowDndDto } from '../tasks/dto/InputFlowDnd.dto';
import { InputFlowDndOptionService } from '../inputFlowDndOption/inputFlowDndOption.service';
import {
  ContentFlowBlockType,
  InputFlowBlockType,
} from '../tasks/dto/contentFlowBlock';
import { Task } from '../tasks/tasks.model';
import { filterBoolean } from '../lib/filterBoolean';
import { InputFlowDndOption } from '../inputFlowDndOption/inputFlowDndOption.model';
import { ServicePromiseHttpResponse } from '../types/ServiceResponse';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class InputFlowDndService {
  constructor(
    private readonly _inputFlowDndOptionService: InputFlowDndOptionService,
    @InjectModel(InputFlowDnd)
    private readonly _inputFlowDndModel: typeof InputFlowDnd,
    @InjectModel(InputFlowDndInput)
    private readonly _inputFlowDndInputModel: typeof InputFlowDndInput,
  ) {}

  async getInputFlowDndByPkWithUserInputOrdered(params: {
    inputFlowDndId: InputFlowDnd['id'];
    userId: User['id'];
  }): Promise<InputFlowDndDto | null> {
    const inputFlowDnd = await this._inputFlowDndModel.findByPk(
      params.inputFlowDndId,
    );

    if (!inputFlowDnd) {
      return null;
    }

    const inputFlowDndInput = await this._inputFlowDndInputModel.findOne({
      where: {
        userId: params.userId,
        inputFlowId: inputFlowDnd.id,
      },
    });

    const commonInputFlowDndData: Omit<InputFlowDndDto, 'options'> = {
      id: inputFlowDnd.id,
      contentType: ContentFlowBlockType.input,
      inputType: InputFlowBlockType.dragAndDrop,
      order: inputFlowDnd.order,
    };

    if (!inputFlowDndInput) {
      const options = (
        await this._inputFlowDndOptionService.getAllInputFlowDndOptions({
          inputFlowDndId: params.inputFlowDndId,
        })
      ).sort((option1, option2) => option1.order - option2.order);

      return {
        ...commonInputFlowDndData,
        options,
      };
    }

    const optionsWithUserInput = (
      await this._inputFlowDndOptionService.getAllInputFlowDndOptionsWithUserInput(
        {
          userId: params.userId,
          inputFlowDndId: params.inputFlowDndId,
          inputFlowDndInputId: inputFlowDndInput.id,
        },
      )
    ).sort((option1, option2) => option1.order - option2.order);

    return {
      ...commonInputFlowDndData,
      options: optionsWithUserInput,
    };
  }

  async getAllInputFlowDndWithUserInput(params: {
    userId: User['id'];
    taskId: Task['id'];
  }): Promise<InputFlowDndDto[]> {
    const inputFlowDnds = await this._inputFlowDndModel.findAll({
      where: { taskId: params.taskId },
    });

    if (!inputFlowDnds.length) {
      return [];
    }

    const getAllInputFlowDndPromises = inputFlowDnds.map(async (inputFlowDnd) =>
      this.getInputFlowDndByPkWithUserInputOrdered({
        inputFlowDndId: inputFlowDnd.id,
        userId: params.userId,
      }),
    );

    const allInputFlowDnds = await Promise.all(getAllInputFlowDndPromises);

    return filterBoolean(allInputFlowDnds);
  }

  async getByPrimaryKey(id: InputFlowDnd['id']): Promise<InputFlowDnd | null> {
    return await this._inputFlowDndModel.findByPk(id);
  }

  private async _saveInputOfOptions(params: {
    dndInputFlowId: InputFlowDnd['id'];
    userId: User['id'];
    order: InputFlowDndOption['id'][];
    options: InputFlowDndOption[];
  }): ServicePromiseHttpResponse {
    let inputFlowDndInput = await this._inputFlowDndInputModel.findOne({
      where: {
        userId: params.userId,
        inputFlowId: params.dndInputFlowId,
      },
    });

    if (!inputFlowDndInput) {
      inputFlowDndInput = await this._inputFlowDndInputModel.create({
        userId: params.userId,
        inputFlowId: params.dndInputFlowId,
      });
    }

    const optionInputs =
      await this._inputFlowDndOptionService.getOrCreateAllOptionInputModelsByOptionIds(
        {
          ids: params.options.map((option) => option.id),
          inputFlowDndInputId: inputFlowDndInput?.id,
        },
      );

    await this._inputFlowDndOptionService.updateOrderOfOptionInputs({
      optionInputs,
      order: params.order,
    });

    return {
      isError: false,
    };
  }

  async saveInputIfExists(params: {
    dndInputFlowId: InputFlowDnd['id'];
    userId: User['id'];
    order: InputFlowDndOption['id'][];
  }): ServicePromiseHttpResponse {
    const inputFlowDnd = await this.getByPrimaryKey(params.dndInputFlowId);

    if (!inputFlowDnd) {
      return {
        isError: true,
        data: {
          code: HttpStatus.BAD_REQUEST,
          message: `Input flow dnd with id ${params.dndInputFlowId} not found`,
        },
      };
    }

    const allOptions =
      await this._inputFlowDndOptionService.getAllInputFlowDndOptionModels({
        inputFlowDndId: params.dndInputFlowId,
      });

    if (
      allOptions.length !== params.order.length ||
      allOptions.some((o) => !params.order.includes(o.id))
    ) {
      return {
        isError: true,
        data: {
          code: HttpStatus.BAD_REQUEST,
          message: `Superfluous or missing options provided. Received option: ${params.order.join(', ')}; expected: ${allOptions.map((o) => o.id).join(', ')}`,
        },
      };
    }

    return this._saveInputOfOptions({
      dndInputFlowId: inputFlowDnd.id,
      userId: params.userId,
      order: params.order,
      options: allOptions,
    });
  }
}
