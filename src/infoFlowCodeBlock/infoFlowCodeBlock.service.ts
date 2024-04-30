import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../tasks/tasks.model';
import { TaskSectionEnum } from '../tasks/types';
import {
  ContentFlowBlockType,
  InfoFlowBlockType,
} from '../tasks/dto/contentFlowBlock';
import { InfoFlowCodeBlock } from './infoFlowCodeBlock.model';
import { InfoFlowCodeBlockDto } from '../tasks/dto/InfoFlowCodeBlock.dto';

@Injectable()
export class InfoFlowCodeBlockService {
  constructor(
    @InjectModel(InfoFlowCodeBlock)
    private readonly _infoFlowCodeBlockModel: typeof InfoFlowCodeBlock,
  ) {}

  async getAllInfoFlowCodeBlocks(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowCodeBlockDto[]> {
    return (
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
  }
}
