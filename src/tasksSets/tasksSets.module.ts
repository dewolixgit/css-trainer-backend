import { Module } from '@nestjs/common';
import { TasksSetsService } from './tasksSets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksSet } from './tasksSets.model';
import { Task } from '../tasks/tasks.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { TasksSetsController } from './tasksSets.controller';

@Module({
  imports: [SequelizeModule.forFeature([TasksSet, TaskStatus, Task])],
  controllers: [TasksSetsController],
  providers: [TasksSetsService],
  exports: [TasksSetsService],
})
export class TasksSetsModule {}
