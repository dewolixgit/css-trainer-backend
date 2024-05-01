import { Module } from '@nestjs/common';
import { TasksSetsService } from './tasksSets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksSet } from './tasksSets.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { TasksSetsController } from './tasksSets.controller';
import { TasksService } from '../tasks/tasks.service';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [SequelizeModule.forFeature([TasksSet, TaskStatus]), TasksModule],
  controllers: [TasksSetsController],
  providers: [TasksSetsService, TasksService],
  exports: [TasksSetsService],
})
export class TasksSetsModule {}
