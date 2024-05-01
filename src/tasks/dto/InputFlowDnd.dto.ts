import { BaseInputFlowBlockDto, InputFlowBlockType } from './contentFlowBlock';

export class InputFlowDndOptionDto {
  id: number;
  code: string;
  order: number;
}

export class InputFlowDndDto extends BaseInputFlowBlockDto {
  inputType: InputFlowBlockType.dragAndDrop;
  options: InputFlowDndOptionDto[];
}
