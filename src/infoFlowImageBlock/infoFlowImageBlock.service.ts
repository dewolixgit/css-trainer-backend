import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InfoFlowImageBlock } from './infoFlowImageBlock.model';
import { Task } from '../tasks/tasks.model';
import { TaskSectionEnum } from '../tasks/types';
import { InfoFlowImageBlockDto } from '../tasks/dto/InfoFlowImageBlock.dto';
import {
  ContentFlowBlockType,
  InfoFlowBlockType,
} from '../tasks/dto/contentFlowBlock';

@Injectable()
export class InfoFlowImageBlockService {
  constructor(
    @InjectModel(InfoFlowImageBlock)
    private readonly _infoFlowImageBlockModel: typeof InfoFlowImageBlock,
  ) {}

  async getAllInfoFlowImageBlocks(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowImageBlockDto[]> {
    return (
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
  }
}
