import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task, TaskSection } from '../tasks/tasks.model';
import { DataTypes } from 'sequelize';

type InfoFlowCodeBlockAttributes = Pick<
  InfoFlowCodeBlock,
  'id' | 'text' | 'order' | 'taskSection' | 'taskId'
>;

export type InfoFlowCodeBlockCreationAttributes = Omit<
  InfoFlowCodeBlockAttributes,
  'id' | 'order'
> &
  Partial<Pick<InfoFlowCodeBlockAttributes, 'order'>>;

@Table({ freezeTableName: true, timestamps: false })
export class InfoFlowCodeBlock extends Model<
  InfoFlowCodeBlockAttributes,
  InfoFlowCodeBlockCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column({ type: DataTypes.STRING(2047) })
  readonly text: string;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column({ type: DataTypes.STRING })
  readonly taskSection: TaskSection;

  @Column
  @ForeignKey(() => Task)
  readonly taskId: number;

  @BelongsTo(() => Task)
  readonly task: Task;
}
