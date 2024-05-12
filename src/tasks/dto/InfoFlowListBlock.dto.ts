import { BaseInfoFlowBlockDto, InfoFlowBlockType } from './contentFlowBlock';

export class InfoFlowListItemDto {
  readonly id: number;
  readonly text: string;
  readonly order: number;
}

export class InfoFlowListBlockDto extends BaseInfoFlowBlockDto {
  readonly infoType: InfoFlowBlockType.list;
  readonly title: string;
  readonly items: InfoFlowListItemDto[];
}
