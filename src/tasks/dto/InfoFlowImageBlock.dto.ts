import { BaseInfoFlowBlockDto, InfoFlowBlockType } from './contentFlowBlock';

export class InfoFlowImageBlockDto extends BaseInfoFlowBlockDto {
  readonly infoType: InfoFlowBlockType.image;
  readonly url: string;
  readonly alt: string;
  readonly linesHeight: number;
}
