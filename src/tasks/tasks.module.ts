import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowImageBlock } from '../infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock/infoFlowCodeBlock.model';
import { InfoFlowTextBlock } from '../infoFlowTextBlock/infoFlowTextBlock.model';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { PartCodeMixedRowTextElement } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.model';
import { PartCodeMixedRowTextElementModule } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.module';
import { PartCodeMixedRowTextElementService } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.service';
import { PartCodeMixedRowCodeElementModule } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.module';
import { PartCodeMixedRowCodeElementService } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.service';
import { InputFlowOnlyCodeService } from '../inputFlowOnlyCode/inputFlowOnlyCode.service';
import { InputFlowOnlyCodeModule } from '../inputFlowOnlyCode/inputFlowOnlyCode.module';
import { InfoFlowImageBlockService } from '../infoFlowImageBlock/infoFlowImageBlock.service';
import { InfoFlowTextBlockService } from '../infoFlowTextBlock/infoFlowTextBlock.service';
import { InfoFlowCodeBlockService } from '../infoFlowCodeBlock/infoFlowCodeBlock.service';
import { InfoFlowImageBlockModule } from '../infoFlowImageBlock/infoFlowImageBlock.module';
import { InfoFlowTextBlockModule } from '../infoFlowTextBlock/infoFlowTextBlock.module';
import { InfoFlowCodeBlockModule } from '../infoFlowCodeBlock/infoFlowCodeBlock.module';
import { PartCodeMixedRowModule } from '../partCodeMixedRow/partCodeMixedRow.module';
import { PartCodeMixedRowService } from '../partCodeMixedRow/partCodeMixedRow.service';
import { PartCodeOnlyRowModule } from '../partCodeOnlyRow/partCodeOnlyRow.module';
import { PartCodeOnlyRowService } from '../partCodeOnlyRow/partCodeOnlyRow.service';
import { InputFlowPartCodeService } from '../inputFlowPartCode/inputFlowPartCode.service';
import { InputFlowPartCodeModule } from '../inputFlowPartCode/inputFlowPartCode.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InfoFlowTextBlock,
      InfoFlowCodeBlock,
      InfoFlowImageBlock,
      InputFlowOnlyCode,
      InputFlowOnlyCodeInput,
      PartCodeMixedRowTextElement,
      PartCodeMixedRowCodeElement,
      PartCodeMixedRowCodeElementInput,
    ]),
    InfoFlowImageBlockModule,
    InfoFlowTextBlockModule,
    InfoFlowCodeBlockModule,
    InputFlowOnlyCodeModule,
    InputFlowPartCodeModule,
    PartCodeOnlyRowModule,
    PartCodeMixedRowModule,
    PartCodeMixedRowTextElementModule,
    PartCodeMixedRowCodeElementModule,
  ],
  providers: [
    TasksService,
    InfoFlowImageBlockService,
    InfoFlowTextBlockService,
    InfoFlowCodeBlockService,
    InputFlowOnlyCodeService,
    InputFlowPartCodeService,
    PartCodeOnlyRowService,
    PartCodeMixedRowService,
    PartCodeMixedRowTextElementService,
    PartCodeMixedRowCodeElementService,
  ],
  exports: [
    TasksService,
    SequelizeModule,
    InfoFlowImageBlockService,
    InfoFlowTextBlockService,
    InfoFlowCodeBlockService,
    InputFlowOnlyCodeService,
    InputFlowPartCodeService,
    PartCodeOnlyRowService,
    PartCodeMixedRowService,
    PartCodeMixedRowTextElementService,
    PartCodeMixedRowCodeElementModule,
  ],
})
export class TasksModule {}
