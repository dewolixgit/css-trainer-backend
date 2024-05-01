import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { User } from '../users/users.model';

export type InputFlowOnlyCodeInputAttributes = Pick<
  InputFlowOnlyCodeInput,
  'id' | 'value' | 'inputFlowId' | 'userId'
>;

export type InputFlowOnlyCodeInputCreationAttributes = Omit<
  InputFlowOnlyCodeInputAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowOnlyCodeInput extends Model<
  InputFlowOnlyCodeInputAttributes,
  InputFlowOnlyCodeInputCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly value: string;

  @Column
  @ForeignKey(() => InputFlowOnlyCode)
  readonly inputFlowId: number;

  @Column
  @ForeignKey(() => User)
  readonly userId: number;
}
