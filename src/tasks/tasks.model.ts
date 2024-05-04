import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { TasksSetAttributes, TasksSet } from '../tasksSets/tasksSets.model';
import { DataTypes } from 'sequelize';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock/infoFlowCodeBlock.model';
import { InfoFlowImageBlock } from '../infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowTextBlock } from '../infoFlowTextBlock/infoFlowTextBlock.model';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowPartCode } from '../inputFlowPartCode/inputFlowPartCode.model';
import { InputFlowDnd } from '../inputFlowDnd/inputFlowDnd.model';
import { ToPartial } from '../types/utils';

export enum TaskSkill {
  text = 'text',
  background = 'background',
  flex = 'flex',
  position = 'position',
  grid = 'grid',
  other = 'other',
}

export const ALL_SKILLS = [
  TaskSkill.text,
  TaskSkill.background,
  TaskSkill.flex,
  TaskSkill.position,
  TaskSkill.grid,
  TaskSkill.other,
];

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
