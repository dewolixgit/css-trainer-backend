import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users';
import { Task } from '../tasks';

export type TaskStatusAttributes = Pick<
  TaskStatus,
  'id' | 'completed' | 'userId' | 'taskId'
>;

export type TaskStatusCreationAttributes = Omit<TaskStatusAttributes, 'id'>;

@Table({ freezeTableName: true, timestamps: false })
export class TaskStatus extends Model<
  TaskStatusAttributes,
  TaskStatusCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly completed: boolean;

  @Column
  @ForeignKey(() => User)
  readonly userId: number;

  @Column
  @ForeignKey(() => Task)
  readonly taskId: number;
}
