import { BaseInputFlowBlockDto, InputFlowBlockType } from './contentFlowBlock';

export class InputFlowDndOptionDto {
  id: number;
  code: string;
}

export class InputFlowDndDto extends BaseInputFlowBlockDto {
  inputType: InputFlowBlockType.dragAndDrop;
  options: InputFlowDndOptionDto[];
}
