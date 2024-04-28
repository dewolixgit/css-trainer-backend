import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Achievement } from '../achievements/achievements.model';

@Table({ freezeTableName: true, timestamps: false })
export class UserAchievement extends Model {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @Column
  @ForeignKey(() => Achievement)
  achievementId: number;
}
