import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Achievement } from '../achievements/achievement.model';
import { UserAchievement } from '../userAchievements/userAchievement.model';

@Table({ freezeTableName: true, timestamps: false })
export class User extends Model {
  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @BelongsToMany(() => Achievement, () => UserAchievement)
  achievements: Achievement[];
}
