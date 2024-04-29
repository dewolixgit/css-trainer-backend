import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InputFlowDnd } from '../inputFlowDnd';
import { InputFlowDndInput } from '../inputFlowDndInput';
import { InputFlowDndOptionInput } from '../inputFlowDndOptionInput';

export type InputFlowDndOptionAttributes = Pick<
  InputFlowDndOption,
  'id' | 'code' | 'initialOrder' | 'inputFlowDndId'
>;

export type InputFlowDndOptionCreationAttributes = Omit<
  InputFlowDndOptionAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowDndOption extends Model<
  InputFlowDndOptionAttributes,
  InputFlowDndOptionCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly code: string;

  @Column
  readonly initialOrder: number;

  @Column
  @ForeignKey(() => InputFlowDnd)
  readonly inputFlowDndId: number;

  @BelongsTo(() => InputFlowDnd)
  readonly inputFlowDnd: InputFlowDnd;

  @BelongsToMany(() => InputFlowDndInput, () => InputFlowDndOptionInput)
  readonly inputFlowDndInputs: InputFlowDndInput[];
}
