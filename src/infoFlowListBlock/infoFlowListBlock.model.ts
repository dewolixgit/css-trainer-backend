import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ToPartial } from '../types/utils';
import { Task, TaskSection } from '../tasks/tasks.model';
import { DataTypes } from 'sequelize';
import { InfoFlowListItem } from '../infoFlowListItem/infoFlowListItem.model';

type InfoFlowListBlockAttributes = Pick<
  InfoFlowListBlock,
  'id' | 'title' | 'order' | 'taskSection' | 'taskId'
>;

export type InfoFlowListBlockCreationAttributes = Omit<
  InfoFlowListBlockAttributes,
  'id' | 'order' | 'linesHeight'
> &
  ToPartial<InfoFlowListBlockAttributes, 'order' | 'title'>;

@Table({ freezeTableName: true, timestamps: false })
export class InfoFlowListBlock extends Model<
  InfoFlowListBlockAttributes,
  InfoFlowListBlockCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly title: string;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column({ type: DataTypes.STRING })
  readonly taskSection: TaskSection;

  @HasMany(() => InfoFlowListItem)
  readonly items: InfoFlowListItem[];

  @Column
  @ForeignKey(() => Task)
  readonly taskId: number;

  @BelongsTo(() => Task)
  readonly task: Task;
}
