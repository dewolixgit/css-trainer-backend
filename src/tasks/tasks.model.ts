import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { TasksSetAttributes, TasksSet } from '../tasksSets';
import { DataTypes } from 'sequelize';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock';
import { InfoFlowImageBlock } from '../infoFlowImageBlock';
import { InfoFlowTextBlock } from '../infoFlowTextBlock';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode';
import { InputFlowPartCode } from '../inputFlowPartCode';
import { InputFlowDnd } from '../inputFlowDnd';
import { ToPartial } from '../types/utils';

export enum TaskSkill {
  text = 'text',
  background = 'background',
  flex = 'flex',
  position = 'position',
  grid = 'grid',
  other = 'other',
}

export enum TaskSection {
  theory = 'theory',
  practice = 'practice',
}

export type TaskAttributes = Pick<
  Task,
  'id' | 'name' | 'skill' | 'order' | 'tasksSetId'
>;

export type TaskCreationAttributes = Omit<TaskAttributes, 'id' | 'order'> &
  ToPartial<TasksSetAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly name: string;

  @Column({ type: DataTypes.STRING })
  readonly skill: TaskSkill;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => TasksSet)
  readonly tasksSetId: number;

  @BelongsTo(() => TasksSet)
  readonly taskSet: TasksSet;

  @HasMany(() => InfoFlowCodeBlock)
  readonly infoFlowCodeBlocks: InfoFlowCodeBlock[];

  @HasMany(() => InfoFlowImageBlock)
  readonly infoFlowImageBlocks: InfoFlowImageBlock[];

  @HasMany(() => InfoFlowTextBlock)
  readonly infoFlowTextBlocks: InfoFlowTextBlock[];

  @HasMany(() => InputFlowOnlyCode)
  readonly inputFlowOnlyCodeBlocks: InputFlowOnlyCode[];

  @HasMany(() => InputFlowPartCode)
  readonly inputFlowPartCodeBlocks: InputFlowPartCode[];

  @HasMany(() => InputFlowDnd)
  readonly inputFlowDndBlocks: InputFlowDnd[];
}
