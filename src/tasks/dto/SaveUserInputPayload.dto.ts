import { InputFlowDndOption } from '../../inputFlowDndOption/inputFlowDndOption.model';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export enum UserInputTypeEnum {
  partCodeMixedRowCodeElement = 'part-code-mixed-row-code-element',
  partCodeOnlyRow = 'part-code-only-row',
  inputFlowDnd = 'input-flow-dnd',
  inputFlowOnlyCode = 'input-flow-only-code',
}

export const userInputTextTypes = [
  UserInputTypeEnum.partCodeMixedRowCodeElement,
  UserInputTypeEnum.partCodeOnlyRow,
  UserInputTypeEnum.inputFlowOnlyCode,
];

export class SaveUserInputPayloadDto {
  @IsInt()
  inputId: number;

  /**
   * A client must define what input has to be saved
   */
  @IsIn([
    UserInputTypeEnum.inputFlowDnd,
    UserInputTypeEnum.inputFlowOnlyCode,
    UserInputTypeEnum.partCodeOnlyRow,
    UserInputTypeEnum.partCodeMixedRowCodeElement,
  ])
  inputType: UserInputTypeEnum;

  /**
   * If we save dnd input, a client must send dnd options in the order they have to be saved
   */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  order?: InputFlowDndOption['id'][];

  /**
   * When we save text input, a client must send a value of the changed input
   */
  @IsOptional()
  @IsString()
  value?: string;

  /**
   * Result of checking if the task has been solved correctly
   */
  @IsBoolean()
  completed: boolean;
}
