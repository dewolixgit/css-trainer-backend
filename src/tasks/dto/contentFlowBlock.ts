export enum ContentFlowBlockType {
  input = 'input',
  info = 'info',
}

export enum InfoFlowBlockType {
  text = 'text',
  image = 'image',
  code = 'code',
}

export class BaseInfoFlowBlockDto {
  readonly id: number;
  readonly contentType: ContentFlowBlockType.info;
  readonly order: number;
}

export enum InputFlowBlockType {
  dragAndDrop = 'drag-and-drop',
  textArea = 'text-area',
  partText = 'part-text',
}

export class BaseInputFlowBlockDto {
  readonly id: number;
  readonly contentType: ContentFlowBlockType.input;
  readonly order: number;
}
