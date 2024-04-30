import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from '../tasks/tasks.model';
import { InputFlowDndOption } from '../inputFlowDndOption/inputFlowDndOption.model';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';
import { User } from '../users/users.model';
import { ToPartial } from '../types/utils';

export type InputFlowDndAttributes = Pick<
  InputFlowDnd,
  'id' | 'order' | 'taskId'
>;

export type InputFlowDndCreationAttributes = Omit<
  InputFlowDndAttributes,
  'id' | 'order'
> &
  ToPartial<InputFlowDndAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowDnd extends Model<
  InputFlowDndAttributes,
  InputFlowDndCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => Task)
  taskId: number;

  @BelongsTo(() => Task)
  task: Task;

  @HasMany(() => InputFlowDndOption)
  readonly inputFlowDndOptions: InputFlowDndOption[];

  @BelongsToMany(() => User, () => InputFlowDndInput)
  readonly users: User[];
}
