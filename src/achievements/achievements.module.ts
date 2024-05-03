import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievement } from './achievements.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';
import { AchievementsService } from './achievements.service';
import { TasksSetsService } from '../tasksSets/tasksSets.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TasksSetsModule } from '../tasksSets/tasksSets.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Achievement, UserAchievement]),
    forwardRef(() => TasksSetsModule),
    UsersModule,
  ],
  providers: [AchievementsService, UsersService, TasksSetsService],
  exports: [
    AchievementsService,
    SequelizeModule,
    UsersService,
    TasksSetsService,
  ],
})
export class AchievementsModule {}
