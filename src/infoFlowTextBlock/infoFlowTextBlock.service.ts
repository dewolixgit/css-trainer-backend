import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../tasks/tasks.model';
import { TaskSectionEnum } from '../tasks/types';
import {
  ContentFlowBlockType,
  InfoFlowBlockType,
} from '../tasks/dto/contentFlowBlock';
import { InfoFlowTextBlock } from './infoFlowTextBlock.model';
import { InfoFlowTextBlockDto } from '../tasks/dto/InfoFlowTextBlock.dto';

@Injectable()
export class InfoFlowTextBlockService {
  constructor(
    @InjectModel(InfoFlowTextBlock)
    private readonly _infoFlowTextBlockModel: typeof InfoFlowTextBlock,
  ) {}

  async getAllInfoFlowTextBlocks(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowTextBlockDto[]> {
    return (
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
  }
}
