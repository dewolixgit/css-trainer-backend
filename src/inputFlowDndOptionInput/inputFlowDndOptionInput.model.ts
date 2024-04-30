import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { InputFlowDndOption } from '../inputFlowDndOption/inputFlowDndOption.model';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';

export type InputFlowDndOptionInputAttributes = Pick<
  InputFlowDndOptionInput,
  'id' | 'order' | 'optionId' | 'inputFlowInputId'
>;

export type InputFLowDndOptionInputCreationAttributes = Omit<
  InputFlowDndOptionInputAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowDndOptionInput extends Model<
  InputFlowDndOptionInputAttributes,
  InputFLowDndOptionInputCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly order: number;

  @Column
  @ForeignKey(() => InputFlowDndOption)
  readonly optionId: number;

  @Column
  @ForeignKey(() => InputFlowDndInput)
  readonly inputFlowInputId: number;
}
