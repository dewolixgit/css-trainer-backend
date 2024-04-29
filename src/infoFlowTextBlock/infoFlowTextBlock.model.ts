import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task, TaskSection } from '../tasks';
import { DataTypes } from 'sequelize';
import { ToPartial } from '../types/utils';

type InfoFlowTextBlockAttributes = Pick<
  InfoFlowTextBlock,
  'id' | 'text' | 'order' | 'taskSection' | 'taskId'
>;

export type InfoFlowTextBlockCreationAttributes = Omit<
  InfoFlowTextBlockAttributes,
  'id' | 'order'
> &
  ToPartial<InfoFlowTextBlockAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class InfoFlowTextBlock extends Model<
  InfoFlowTextBlockAttributes,
  InfoFlowTextBlockCreationAttributes
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
