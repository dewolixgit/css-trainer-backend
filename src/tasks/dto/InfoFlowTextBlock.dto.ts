import { BaseInfoFlowBlockDto, InfoFlowBlockType } from './contentFlowBlock';

export class InfoFlowTextBlockDto extends BaseInfoFlowBlockDto {
  readonly infoType: InfoFlowBlockType.text;
  readonly text: string;
}
