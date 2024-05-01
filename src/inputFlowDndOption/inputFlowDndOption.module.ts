import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InputFlowDndOption } from './inputFlowDndOption.model';
import { InputFlowDndOptionInput } from '../inputFlowDndOptionInput/inputFlowDndOptionInput.model';
import { InputFlowDndOptionService } from './inputFlowDndOption.service';

@Module({
  imports: [
    SequelizeModule.forFeature([InputFlowDndOption, InputFlowDndOptionInput]),
  ],
  providers: [InputFlowDndOptionService],
  exports: [SequelizeModule, InputFlowDndOptionService],
})
export class InputFlowDndOptionModule {}
