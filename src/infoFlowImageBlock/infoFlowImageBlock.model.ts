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

type InfoFlowImageBlockAttributes = Pick<
  InfoFlowImageBlock,
  'id' | 'url' | 'linesHeight' | 'alt' | 'order' | 'taskSection' | 'taskId'
>;

export type InfoFlowImageBlockCreationAttributes = Omit<
  InfoFlowImageBlockAttributes,
  'id' | 'order' | 'linesHeight'
> &
  ToPartial<InfoFlowImageBlockAttributes, 'order' | 'linesHeight'>;

@Table({ freezeTableName: true, timestamps: false })
export class InfoFlowImageBlock extends Model<
  InfoFlowImageBlockAttributes,
  InfoFlowImageBlockCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly url: string;

  @Column
  readonly alt: string;

  @Column({ defaultValue: 6 })
  readonly linesHeight: number;

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
