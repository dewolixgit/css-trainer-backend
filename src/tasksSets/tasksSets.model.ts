import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Topic } from '../topic';
import { ToPartial } from '../types/utils';

export type TasksSetAttributes = Pick<
  TasksSet,
  'id' | 'name' | 'previewName' | 'description' | 'image' | 'order' | 'topicId'
>;

export type TasksSetCreationAttributes = Omit<
  TasksSetAttributes,
  'id' | 'order'
> &
  ToPartial<TasksSetAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class TasksSet extends Model<
  TasksSetAttributes,
  TasksSetCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly name: string;

  @Column
  readonly previewName: string;

  @Column
  readonly description: string;

  @Column
  readonly image: string;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  @ForeignKey(() => Topic)
  readonly topicId: number | null;

  @BelongsTo(() => Topic)
  readonly topic: Topic | null;
}
