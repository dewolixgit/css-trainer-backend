import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Achievement } from '../achievements';
import { UserAchievement } from '../userAchievements';
import { TaskStatus } from '../taskStatus';
import { Task } from '../tasks';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput';
import { PartCodeOnlyRowInput } from '../partCodeOnlyRowInput';
import { PartCodeOnlyRow } from '../partCodeOnlyRow';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput';
import { InputFlowDndInput } from '../inputFlowDndInput';
import { InputFlowDnd } from '../inputFlowDnd';

export type UserAttributes = Pick<
  User,
  'id' | 'email' | 'achievements' | 'password'
>;

export type UserCreationAttributes = Omit<
  UserAttributes,
  'achievements' | 'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column({ unique: true })
  readonly email: string;

  @Column
  readonly password: string;

  @BelongsToMany(() => Achievement, () => UserAchievement)
  readonly achievements: Achievement[];

  @BelongsToMany(() => Task, () => TaskStatus)
  readonly tasks: Task[];

  @BelongsToMany(() => InputFlowOnlyCode, () => InputFlowOnlyCodeInput)
  readonly inputFlowOnlyCodeBlocks: InputFlowOnlyCode[];

  @BelongsToMany(() => PartCodeOnlyRow, () => PartCodeOnlyRowInput)
  readonly partCodeOnlyRows: PartCodeOnlyRow[];

  @BelongsToMany(
    () => PartCodeMixedRowCodeElement,
    () => PartCodeMixedRowCodeElementInput,
  )
  readonly partCodeMixedRowCodeElements: PartCodeMixedRowCodeElementInput[];

  @BelongsToMany(() => InputFlowDnd, () => InputFlowDndInput)
  readonly inputFlowDndBlocks: InputFlowDnd[];
}
