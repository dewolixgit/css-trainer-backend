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
} from './dto/contentFlowBlock';
import { InfoFlowTextBlockDto } from './dto/InfoFlowTextBlock.dto';
import { InfoFlowCodeBlockDto } from './dto/InfoFlowCodeBlock.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(InfoFlowImageBlock)
    private readonly _infoFlowImageBlockModel: typeof InfoFlowImageBlock,
    @InjectModel(InfoFlowTextBlock)
    private readonly _infoFlowTextBlockModel: typeof InfoFlowTextBlock,
    @InjectModel(InfoFlowCodeBlock)
    private readonly _infoFlowCodeBlockModel: typeof InfoFlowCodeBlock,
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
}
