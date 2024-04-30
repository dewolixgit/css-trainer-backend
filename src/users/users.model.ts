import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Achievement } from '../achievements/achievements.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { Task } from '../tasks/tasks.model';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { PartCodeOnlyRowInput } from '../partCodeOnlyRowInput/partCodeOnlyRowInput.model';
import { PartCodeOnlyRow } from '../partCodeOnlyRow/partCodeOnlyRow.model';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';
import { InputFlowDnd } from '../inputFlowDnd/inputFlowDnd.model';

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
