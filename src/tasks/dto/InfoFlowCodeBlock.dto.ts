import { BaseInfoFlowBlockDto, InfoFlowBlockType } from './contentFlowBlock';

export class InfoFlowCodeBlockDto extends BaseInfoFlowBlockDto {
  readonly infoType: InfoFlowBlockType.code;
  readonly text: string;
}
