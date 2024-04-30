import { BaseInputFlowBlockDto, InputFlowBlockType } from './contentFlowBlock';

export enum PartCodeMixedRowElementType {
  code = 'code',
  text = 'text',
}

export class BasePartCodeMixedRowElementDto {
  readonly id: number;
  readonly order: number;
}

export class PartCodeMixedRowCodeElementDto extends BasePartCodeMixedRowElementDto {
  readonly type: PartCodeMixedRowElementType.code;
  readonly value: string;
  readonly symbolsLength: number;
}

export class PartCodeMixedRowTextElementDto extends BasePartCodeMixedRowElementDto {
  readonly type: PartCodeMixedRowElementType.text;
  readonly text: string;
}

export enum PartCodeRowType {
  mixed = 'mixed',
  code = 'code',
}

export class BaseInputFlowPartCodeRowDto {
  readonly id: number;
  readonly tabs: number;
  readonly order: number;
}

export class PartCodeMixedRowDto extends BaseInputFlowPartCodeRowDto {
  readonly type: PartCodeRowType.mixed;
  readonly elements: (
    | PartCodeMixedRowCodeElementDto
    | PartCodeMixedRowTextElementDto
  )[];
}

export class PartCodeOnlyRowDto extends BaseInputFlowPartCodeRowDto {
  readonly type: PartCodeRowType.code;
  readonly linesCount: number;
  readonly value: string;
}

export class InputFlowPartCodeDto extends BaseInputFlowBlockDto {
  inputType: InputFlowBlockType.partText;
  rows: (PartCodeMixedRowDto | PartCodeOnlyRowDto)[];
}
