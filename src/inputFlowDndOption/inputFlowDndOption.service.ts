import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InputFlowDndOption } from './inputFlowDndOption.model';
import { InputFlowDndOptionInput } from '../inputFlowDndOptionInput/inputFlowDndOptionInput.model';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';
import { InputFlowDndOptionDto } from '../tasks/dto/InputFlowDnd.dto';
import { User } from '../users/users.model';
import { InputFlowDnd } from '../inputFlowDnd/inputFlowDnd.model';

@Injectable()
export class InputFlowDndOptionService {
  constructor(
    @InjectModel(InputFlowDndOption)
    private readonly _inputFlowDndOptionModel: typeof InputFlowDndOption,
    @InjectModel(InputFlowDndOptionInput)
    private readonly _inputFlowDndOptionInputModel: typeof InputFlowDndOptionInput,
  ) {}

  /**
   * @param params.optionInputs Option inputs to update
   * @param params.order New order of corresponding options. Values of the array are ids of the options
   */
  async updateOrderOfOptionInputs(params: {
    optionInputs: InputFlowDndOptionInput[];
    order: InputFlowDndOption['id'][];
  }): Promise<void> {
    const optionToOrderMap = params.order.reduce<
      Record<InputFlowDndOption['id'], number>
    >(
      (acc, optionId, order) => ({
        ...acc,
        [optionId]: order + 1,
      }),
      {},
    );

    const updateOptionInputPromises = params.optionInputs.map(
      async (optionInput) =>
        await optionInput.update({
          order: optionToOrderMap[optionInput.optionId],
        }),
    );

    await Promise.all(updateOptionInputPromises);
  }

  async getOrCreateAllOptionInputModelsByOptionIds(params: {
    ids: InputFlowDndOption['id'][];
    inputFlowDndInputId: InputFlowDndInput['id'];
  }): Promise<InputFlowDndOptionInput[]> {
    return Promise.all(
      params.ids.map(
        async (id) =>
          (
            await this._inputFlowDndOptionInputModel.findOrCreate({
              where: {
                inputFlowInputId: params.inputFlowDndInputId,
                optionId: id,
              },
            })
          )[0],
      ),
    );
  }

  async getAllInputFlowDndOptionModels(params: {
    inputFlowDndId: InputFlowDnd['id'];
  }): Promise<InputFlowDndOption[]> {
    return await this._inputFlowDndOptionModel.findAll({
      where: {
        inputFlowDndId: params.inputFlowDndId,
      },
    });
  }

  async getAllInputFlowDndOptions(params: {
    inputFlowDndId: InputFlowDnd['id'];
  }): Promise<InputFlowDndOptionDto[]> {
    return (
      await this.getAllInputFlowDndOptionModels({
        inputFlowDndId: params.inputFlowDndId,
      })
    ).map((option) => ({
      id: option.id,
      code: option.code,
      order: option.initialOrder,
    }));
  }

  async getAllInputFlowDndOptionsWithUserInput(params: {
    inputFlowDndId: InputFlowDnd['id'];
    inputFlowDndInputId: InputFlowDndInput['id'];
    userId: User['id'];
  }): Promise<InputFlowDndOptionDto[]> {
    const options = await this._inputFlowDndOptionModel.findAll({
      where: {
        inputFlowDndId: params.inputFlowDndId,
      },
    });

    if (!options.length) {
      return [];
    }

    const getOptionInputsPromises = options.map((option) =>
      this._inputFlowDndOptionInputModel.findOne({
        where: {
          inputFlowInputId: params.inputFlowDndInputId,
          optionId: option.id,
        },
      }),
    );

    const optionInputs = await Promise.all(getOptionInputsPromises);

    return options.map((option) => ({
      id: option.id,
      code: option.code,
      order:
        optionInputs.find((input) => input?.optionId === option.id)?.order ??
        option.initialOrder,
    }));
  }
}
