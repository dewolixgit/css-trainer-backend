import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Achievement } from '../achievements/achievements.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';

export type UserModelAttributes = Pick<
  User,
  'id' | 'email' | 'achievements' | 'password'
>;

export type UserModelCreationAttributes = Omit<
  UserModelAttributes,
  'achievements' | 'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class User extends Model<
  UserModelAttributes,
  UserModelCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @BelongsToMany(() => Achievement, () => UserAchievement)
  achievements: Achievement[];
}
