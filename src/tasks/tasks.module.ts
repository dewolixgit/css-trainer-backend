import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowImageBlock } from '../infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock/infoFlowCodeBlock.model';
import { InfoFlowTextBlock } from '../infoFlowTextBlock/infoFlowTextBlock.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InfoFlowTextBlock,
      InfoFlowCodeBlock,
      InfoFlowImageBlock,
    ]),
  ],
  providers: [TasksService],
  exports: [TasksService, SequelizeModule],
})
export class TasksModule {}
