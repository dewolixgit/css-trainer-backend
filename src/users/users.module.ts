import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { AchievementsModule } from '../achievements/achievements.module';
import { AchievementsService } from '../achievements/achievements.service';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, TaskStatus]), AchievementsModule],
  controllers: [UsersController],
  providers: [UsersService, AchievementsService],
  exports: [SequelizeModule, UsersService, AchievementsService],
})
export class UsersModule {}
