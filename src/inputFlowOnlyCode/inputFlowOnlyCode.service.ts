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

@Injectable()
export class InputFlowOnlyCodeService {
  constructor(
    @InjectModel(InputFlowOnlyCode)
    private readonly _inputFlowOnlyCodeModel: typeof InputFlowOnlyCode,
    @InjectModel(InputFlowOnlyCodeInput)
    private readonly _inputFlowOnlyCodeInputModel: typeof InputFlowOnlyCodeInput,
  ) {}

  async getAllInputFlowOnlyCodeBlocksWithUserInput(params: {
    taskId: Task['id'];
    userId: User['id'];
  }): Promise<InputFlowOnlyCodeDto[]> {
    const inputFlowOnlyCodeBlocks = await this._inputFlowOnlyCodeModel.findAll({
      where: { taskId: params.taskId },
    });

    if (!inputFlowOnlyCodeBlocks.length) {
      return [];
    }

    const getInputFlowOnlyCodeInputPromises = inputFlowOnlyCodeBlocks.map(
      async (flowOnlyCodeBlock): Promise<InputFlowOnlyCodeInput | null> =>
        this._inputFlowOnlyCodeInputModel.findOne({
          where: {
            userId: params.userId,
            inputFlowId: flowOnlyCodeBlock.id,
          },
        }),
    );

    const inputFlowOnlyCodeInput = await Promise.all(
      getInputFlowOnlyCodeInputPromises,
    );

    const inputFlowOnlyCodeWithUserInput =
      inputFlowOnlyCodeBlocks.map<InputFlowOnlyCodeDto>((inputFlowBlock) => ({
        id: inputFlowBlock.id,
        contentType: ContentFlowBlockType.input,
        inputType: InputFlowBlockType.textArea,
        order: inputFlowBlock.order,
        linesCount: inputFlowBlock.linesHeight,
        value:
          inputFlowOnlyCodeInput.find(
            (input) => input && input.inputFlowId === inputFlowBlock.id,
          )?.value ?? '',
      }));

    return inputFlowOnlyCodeWithUserInput;
  }
}
