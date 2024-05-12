import { forwardRef, Module } from '@nestjs/common';
import { TasksSetsService } from './tasksSets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksSet } from './tasksSets.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { TasksSetsController } from './tasksSets.controller';
import { TasksService } from '../tasks/tasks.service';
import { TasksModule } from '../tasks/tasks.module';
import { TopicsModule } from '../topics/topics.module';
import { TopicsService } from '../topics/topics.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TasksSet, TaskStatus]),
    TasksModule,
    forwardRef(() => TopicsModule),
  ],
  controllers: [TasksSetsController],
  providers: [TasksSetsService, TasksService, TopicsService],
  exports: [SequelizeModule, TasksSetsService, TasksService, TopicsService],
})
export class TasksSetsModule {}
