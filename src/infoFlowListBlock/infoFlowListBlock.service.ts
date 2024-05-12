import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InfoFlowListBlock } from './infoFlowListBlock.model';
import { InfoFlowListItemService } from '../infoFlowListItem/infoFlowListItem.service';
import { Task } from '../tasks/tasks.model';
import { TaskSectionEnum } from '../tasks/types';
import { InfoFlowListItem } from '../infoFlowListItem/infoFlowListItem.model';
import { InfoFlowListBlockDto } from '../tasks/dto/InfoFlowListBlock.dto';
import {
  ContentFlowBlockType,
  InfoFlowBlockType,
} from '../tasks/dto/contentFlowBlock';

@Injectable()
export class InfoFlowListBlockService {
  constructor(
    @InjectModel(InfoFlowListBlock)
    private readonly _infoFlowListBlockModel: typeof InfoFlowListBlock,
    private readonly _infoFlowListItemService: InfoFlowListItemService,
  ) {}

  toDto(infoFlowBlock: InfoFlowListBlock): InfoFlowListBlockDto {
    return {
      id: infoFlowBlock.id,
      contentType: ContentFlowBlockType.info,
      infoType: InfoFlowBlockType.list,
      title: infoFlowBlock.title,
      order: infoFlowBlock.order,
      items: infoFlowBlock.items.map((item) => {
        return this._infoFlowListItemService.toDto(item);
      }),
    };
  }

  async getAllInfoFlowListBlocksOrdered(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowListBlock[]> {
    return this._infoFlowListBlockModel.findAll({
      where: { taskId: params.taskId, taskSection: params.section },
      include: {
        model: InfoFlowListItem,
        as: 'items',
        separate: true,
        order: [['order', 'ASC']],
      },
    });
  }

  async getAllInfoFlowListBlocksOrderedDto(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowListBlockDto[]> {
    return (
      await this.getAllInfoFlowListBlocksOrdered({
        taskId: params.taskId,
        section: params.section,
      })
    ).map((block) => this.toDto(block));
  }
}
