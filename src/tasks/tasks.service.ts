import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InfoFlowImageBlock } from '../infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowTextBlock } from '../infoFlowTextBlock/infoFlowTextBlock.model';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock/infoFlowCodeBlock.model';
import { Task } from './tasks.model';
import { InfoFlowBlocksDtoUnion, TaskSectionEnum } from './types';
import { InfoFlowImageBlockDto } from './dto/InfoFlowImageBlock.dto';
import {
  ContentFlowBlockType,
  InfoFlowBlockType,
  InputFlowBlockType,
} from './dto/contentFlowBlock';
import { InfoFlowTextBlockDto } from './dto/InfoFlowTextBlock.dto';
import { InfoFlowCodeBlockDto } from './dto/InfoFlowCodeBlock.dto';
import { InputFlowOnlyCodeDto } from './dto/InputFlowOnlyCode.dto';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { User } from '../users/users.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(InfoFlowImageBlock)
    private readonly _infoFlowImageBlockModel: typeof InfoFlowImageBlock,
    @InjectModel(InfoFlowTextBlock)
    private readonly _infoFlowTextBlockModel: typeof InfoFlowTextBlock,
    @InjectModel(InfoFlowCodeBlock)
    private readonly _infoFlowCodeBlockModel: typeof InfoFlowCodeBlock,
    @InjectModel(InputFlowOnlyCode)
    private readonly _inputFlowOnlyCodeModel: typeof InputFlowOnlyCode,
    @InjectModel(InputFlowOnlyCodeInput)
    private readonly _inputFlowOnlyCodeInputModel: typeof InputFlowOnlyCodeInput,
  ) {}

  async getAllInfoFlowBlocks(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowBlocksDtoUnion[]> {
    const infoFlowImageBlocks = (
      await this._infoFlowImageBlockModel.findAll({
        where: { taskId: params.taskId, taskSection: params.section },
      })
    ).map<InfoFlowImageBlockDto>((block) => ({
      id: block.id,
      infoType: InfoFlowBlockType.image,
      contentType: ContentFlowBlockType.info,
      url: block.url,
      alt: block.alt,
      linesHeight: block.linesHeight,
      order: block.order,
    }));

    const infoFlowTextBlocks = (
      await this._infoFlowTextBlockModel.findAll({
        where: { taskId: params.taskId, taskSection: params.section },
      })
    ).map<InfoFlowTextBlockDto>((block) => ({
      id: block.id,
      infoType: InfoFlowBlockType.text,
      contentType: ContentFlowBlockType.info,
      text: block.text,
      order: block.order,
    }));

    const infoFlowCodeBlocks = (
      await this._infoFlowCodeBlockModel.findAll({
        where: { taskId: params.taskId, taskSection: params.section },
      })
    ).map<InfoFlowCodeBlockDto>((block) => ({
      id: block.id,
      infoType: InfoFlowBlockType.code,
      contentType: ContentFlowBlockType.info,
      text: block.text,
      order: block.order,
    }));

    return [
      ...infoFlowImageBlocks,
      ...infoFlowTextBlocks,
      ...infoFlowCodeBlocks,
    ];
  }

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

    if (!inputFlowOnlyCodeInput.length) {
      return [];
    }

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

    console.log(
      'inputFlowOnlyCodeWithUserInput',
      inputFlowOnlyCodeWithUserInput,
    );

    return inputFlowOnlyCodeWithUserInput;
  }

  // async getAllInputFlowDndBlocks(params: {
  //   taskId: Task['id'];
  // }): Promise<InputFlowDndDto[]> {}
}
