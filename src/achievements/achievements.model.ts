import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';

export type AchievementAttributes = Pick<
  Achievement,
  'id' | 'name' | 'description' | 'order'
>;

export type ToPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AchievementCreationAttributes = Omit<
  AchievementAttributes,
  'id' | 'order'
> &
  Partial<Pick<AchievementAttributes, 'order'>>;

@Table({ freezeTableName: true, timestamps: false })
export class Achievement extends Model<
  AchievementAttributes,
  AchievementCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly name: string;

  @Column
  readonly description: string;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @BelongsToMany(() => User, () => UserAchievement)
  readonly users: User[];
}
