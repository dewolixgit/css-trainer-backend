import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Achievement } from '../achievements/achievements.model';

export type UserAchievementAttributes = Pick<
  UserAchievement,
  'id' | 'userId' | 'achievementId'
>;

export type UserAchievementCreationAttributes = Omit<
  UserAchievementAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class UserAchievement extends Model<
  UserAchievementAttributes,
  UserAchievementCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  @ForeignKey(() => User)
  readonly userId: number;

  @Column
  @ForeignKey(() => Achievement)
  readonly achievementId: number;
}
