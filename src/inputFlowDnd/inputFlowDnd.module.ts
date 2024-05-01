import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InputFlowDnd } from './inputFlowDnd.model';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';
import { InputFlowDndService } from './inputFlowDnd.service';
import { InputFlowDndOptionService } from '../inputFlowDndOption/inputFlowDndOption.service';
import { InputFlowDndOptionModule } from '../inputFlowDndOption/inputFlowDndOption.module';

@Module({
  imports: [
    SequelizeModule.forFeature([InputFlowDnd, InputFlowDndInput]),
    InputFlowDndOptionModule,
  ],
  providers: [InputFlowDndService, InputFlowDndOptionService],
  exports: [InputFlowDndService, SequelizeModule, InputFlowDndOptionService],
})
export class InputFlowDndModule {}
