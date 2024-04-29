import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import {
  InputFlowOnlyCode,
  InputFlowOnlyCodeAttributes,
} from '../inputFlowOnlyCode';
import { User } from '../users';

export type InputFlowOnlyCodeInputAttributes = Pick<
  InputFlowOnlyCodeInput,
  'id' | 'value' | 'inputFlowId'
>;

export type InputFlowOnlyCodeInputCreationAttributes = Omit<
  InputFlowOnlyCodeInputAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowOnlyCodeInput extends Model<
  InputFlowOnlyCodeAttributes,
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
  userId: number;
}
