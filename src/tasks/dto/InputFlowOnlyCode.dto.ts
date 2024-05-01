import { BaseInputFlowBlockDto, InputFlowBlockType } from './contentFlowBlock';

export class InputFlowOnlyCodeDto extends BaseInputFlowBlockDto {
  inputType: InputFlowBlockType.textArea;
  linesCount: number;
  value: string;
}
