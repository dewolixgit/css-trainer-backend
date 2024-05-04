import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievement } from './achievements.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';
import { AchievementsService } from './achievements.service';
import { TasksSetsService } from '../tasksSets/tasksSets.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TasksSetsModule } from '../tasksSets/tasksSets.module';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Achievement, UserAchievement]),
    TasksSetsModule,
    forwardRef(() => UsersModule),
    TasksModule,
  ],
  providers: [
    AchievementsService,
    UsersService,
    TasksSetsService,
    TasksService,
  ],
  exports: [
    AchievementsService,
    SequelizeModule,
    UsersService,
    TasksSetsService,
    TasksService,
  ],
})
export class AchievementsModule {}
