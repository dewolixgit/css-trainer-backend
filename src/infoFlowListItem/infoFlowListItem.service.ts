import { Injectable } from '@nestjs/common';
import { InfoFlowListItem } from './infoFlowListItem.model';
import { InjectModel } from '@nestjs/sequelize';
import { InfoFlowListBlock } from '../infoFlowListBlock/infoFlowListBlock.model';
import { InfoFlowListItemDto } from '../tasks/dto/InfoFlowListBlock.dto';

@Injectable()
export class InfoFlowListItemService {
  constructor(
    @InjectModel(InfoFlowListItem)
    private readonly _infoFlowListItemModel: typeof InfoFlowListItem,
  ) {}

  toDto(item: InfoFlowListItem): InfoFlowListItemDto {
    return {
      id: item.id,
      text: item.text,
      order: item.order,
    };
  }

  async getAllInfoFlowListItemsByInfoFlowListId(params: {
    infoFlowListId: InfoFlowListBlock['id'];
  }): Promise<InfoFlowListItem[]> {
    return this._infoFlowListItemModel.findAll({
      where: {
        flowBlockId: params.infoFlowListId,
      },
    });
  }

  async getAllInfoFlowListItemsByInfoFlowListIdDto(params: {
    infoFlowListId: InfoFlowListBlock['id'];
  }): Promise<InfoFlowListItemDto[]> {
    return (
      await this.getAllInfoFlowListItemsByInfoFlowListId({
        infoFlowListId: params.infoFlowListId,
      })
    ).map(this.toDto);
  }
}
