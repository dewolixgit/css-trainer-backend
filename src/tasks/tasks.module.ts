import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { PartCodeMixedRowTextElement } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.model';
import { InputFlowOnlyCodeService } from '../inputFlowOnlyCode/inputFlowOnlyCode.service';
import { InputFlowOnlyCodeModule } from '../inputFlowOnlyCode/inputFlowOnlyCode.module';
import { InfoFlowImageBlockService } from '../infoFlowImageBlock/infoFlowImageBlock.service';
import { InfoFlowTextBlockService } from '../infoFlowTextBlock/infoFlowTextBlock.service';
import { InfoFlowCodeBlockService } from '../infoFlowCodeBlock/infoFlowCodeBlock.service';
import { InfoFlowImageBlockModule } from '../infoFlowImageBlock/infoFlowImageBlock.module';
import { InfoFlowTextBlockModule } from '../infoFlowTextBlock/infoFlowTextBlock.module';
import { InfoFlowCodeBlockModule } from '../infoFlowCodeBlock/infoFlowCodeBlock.module';
import { PartCodeOnlyRowModule } from '../partCodeOnlyRow/partCodeOnlyRow.module';
import { PartCodeOnlyRowService } from '../partCodeOnlyRow/partCodeOnlyRow.service';
import { InputFlowPartCodeService } from '../inputFlowPartCode/inputFlowPartCode.service';
import { InputFlowPartCodeModule } from '../inputFlowPartCode/inputFlowPartCode.module';
import { InputFlowDndModule } from '../inputFlowDnd/inputFlowDnd.module';
import { InputFlowDndService } from '../inputFlowDnd/inputFlowDnd.service';
import { Task } from './tasks.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { TasksController } from './tasks.controller';
import { PartCodeMixedRowCodeElementModule } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.module';
import { PartCodeMixedRowCodeElementService } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.service';
import { AchievementsModule } from '../achievements/achievements.module';
import { AchievementsService } from '../achievements/achievements.service';
import { InfoFlowListBlockModule } from '../infoFlowListBlock/infoFlowListBlock.module';
import { InfoFlowListBlockService } from '../infoFlowListBlock/infoFlowListBlock.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Task,
      TaskStatus,
      InputFlowOnlyCode,
      InputFlowOnlyCodeInput,
      PartCodeMixedRowTextElement,
      PartCodeMixedRowCodeElement,
      PartCodeMixedRowCodeElementInput,
    ]),
    forwardRef(() => AchievementsModule),
    InfoFlowImageBlockModule,
    InfoFlowTextBlockModule,
    InfoFlowListBlockModule,
    InfoFlowCodeBlockModule,
    InputFlowOnlyCodeModule,
    InputFlowPartCodeModule,
    PartCodeMixedRowCodeElementModule,
    PartCodeOnlyRowModule,
    InputFlowDndModule,
  ],
  controllers: [TasksController],
  providers: [
    AchievementsService,
    TasksService,
    InfoFlowImageBlockService,
    InfoFlowTextBlockService,
    InfoFlowListBlockService,
    InfoFlowCodeBlockService,
    InputFlowOnlyCodeService,
    InputFlowPartCodeService,
    PartCodeMixedRowCodeElementService,
    PartCodeOnlyRowService,
    InputFlowDndService,
  ],
  exports: [
    AchievementsService,
    TasksService,
    SequelizeModule,
    InfoFlowImageBlockService,
    InfoFlowTextBlockService,
    InfoFlowListBlockService,
    InfoFlowCodeBlockService,
    InputFlowOnlyCodeService,
    InputFlowPartCodeService,
    PartCodeMixedRowCodeElementService,
    PartCodeOnlyRowService,
    InputFlowDndService,
  ],
})
export class TasksModule {}
