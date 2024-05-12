import { forwardRef, Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TasksSetsModule } from '../tasksSets/tasksSets.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from './topics.model';
import { TasksSetsService } from '../tasksSets/tasksSets.service';

@Module({
  imports: [
    forwardRef(() => TasksSetsModule),
    SequelizeModule.forFeature([Topic]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService, TasksSetsService],
  exports: [SequelizeModule, TopicsService, TasksSetsService],
})
export class TopicsModule {}
