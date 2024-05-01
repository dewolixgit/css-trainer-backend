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
}
