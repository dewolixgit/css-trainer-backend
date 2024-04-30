import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowImageBlock } from '../infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock/infoFlowCodeBlock.model';
import { InfoFlowTextBlock } from '../infoFlowTextBlock/infoFlowTextBlock.model';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InfoFlowTextBlock,
      InfoFlowCodeBlock,
      InfoFlowImageBlock,
      InputFlowOnlyCode,
      InputFlowOnlyCodeInput,
    ]),
  ],
  providers: [TasksService],
  exports: [TasksService, SequelizeModule],
})
export class TasksModule {}
