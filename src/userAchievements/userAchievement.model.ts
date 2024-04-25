import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Achievement } from '../achievements/achievement.model';

@Table({ freezeTableName: true, timestamps: false })
export class UserAchievement extends Model {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @Column
  @ForeignKey(() => Achievement)
  achievementId: number;
}
