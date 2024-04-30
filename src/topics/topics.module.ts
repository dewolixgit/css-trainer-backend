import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TasksSetsModule } from '../tasksSets/tasksSets.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from './topics.model';

@Module({
  imports: [TasksSetsModule, SequelizeModule.forFeature([Topic])],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
