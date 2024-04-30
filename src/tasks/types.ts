import { InfoFlowCodeBlockDto } from './dto/InfoFlowCodeBlock.dto';
import { InfoFlowImageBlockDto } from './dto/InfoFlowImageBlock.dto';
import { InfoFlowTextBlockDto } from './dto/InfoFlowTextBlock.dto';

export type InfoFlowBlocksDtoUnion =
  | InfoFlowTextBlockDto
  | InfoFlowImageBlockDto
  | InfoFlowCodeBlockDto;

export enum TaskSectionEnum {
  theory = 'theory',
  practice = 'practice',
}
