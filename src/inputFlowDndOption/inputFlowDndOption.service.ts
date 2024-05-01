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
    // Todo: remove unused
    @InjectModel(InputFlowDndOption)
    private readonly _inputFlowDndOptionModel: typeof InputFlowDndOption,
    @InjectModel(InputFlowDndOptionInput)
    private readonly _inputFlowDndOptionInputModel: typeof InputFlowDndOptionInput,
  ) {}

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
