import { InfoFlowCodeBlockDto } from './dto/InfoFlowCodeBlock.dto';
import { InfoFlowImageBlockDto } from './dto/InfoFlowImageBlock.dto';
import { InfoFlowTextBlockDto } from './dto/InfoFlowTextBlock.dto';
import { InputFlowDndDto } from './dto/InputFlowDnd.dto';
import { InputFlowOnlyCodeDto } from './dto/InputFlowOnlyCode.dto';
import { InputFlowPartCodeDto } from './dto/InputFlowPartCode.dto';
import { InfoFlowListBlockDto } from './dto/InfoFlowListBlock.dto';

export type InfoFlowBlocksDtoUnion =
  | InfoFlowTextBlockDto
  | InfoFlowListBlockDto
  | InfoFlowImageBlockDto
  | InfoFlowCodeBlockDto;

export enum TaskSectionEnum {
  theory = 'theory',
  practice = 'practice',
}

export type InputFlowBlocksDtoUnion =
  | InputFlowDndDto
  | InputFlowOnlyCodeDto
  | InputFlowPartCodeDto;

export type ContentFlowBlocksDtoUnion =
  | InfoFlowBlocksDtoUnion
  | InputFlowBlocksDtoUnion;
