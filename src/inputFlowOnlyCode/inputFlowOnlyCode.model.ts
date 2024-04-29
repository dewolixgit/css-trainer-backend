import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from '../tasks';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput';
import { User } from '../users';
import { ToPartial } from '../types/utils';

export type InputFlowOnlyCodeAttributes = Pick<
  InputFlowOnlyCode,
  'id' | 'linesHeight' | 'order' | 'taskId'
>;

export type InputFlowOnlyCodeCreationAttributes = Omit<
  InputFlowOnlyCodeAttributes,
  'id' | 'order'
> &
  ToPartial<InputFlowOnlyCodeAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowOnlyCode extends Model<
  InputFlowOnlyCodeAttributes,
  InputFlowOnlyCodeCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly linesHeight: number;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => Task)
  readonly taskId: number;

  @BelongsTo(() => Task)
  readonly task: Task;

  @BelongsToMany(() => User, () => InputFlowOnlyCodeInput)
  readonly users: User[];
}
