import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';

@Table({ freezeTableName: true, timestamps: false })
export class Achievement extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @Column({ defaultValue: 0 })
  order: number;

  @BelongsToMany(() => User, () => UserAchievement)
  users: User[];
}
