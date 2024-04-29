import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { TasksSet } from '../tasksSet';
import { ToPartial } from '../types/utils';

export type TopicAttributes = Pick<
  Topic,
  'id' | 'name' | 'previewName' | 'description' | 'image' | 'order'
>;

export type TopicCreationAttributes = Omit<TopicAttributes, 'id' | 'order'> &
  ToPartial<TopicAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class Topic extends Model<TopicAttributes, TopicCreationAttributes> {
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

  @HasMany(() => TasksSet)
  readonly taskSets: TasksSet[];
}
