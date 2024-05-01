import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InputFlowOnlyCode } from './inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { InputFlowOnlyCodeService } from './inputFlowOnlyCode.service';

@Module({
  imports: [
    SequelizeModule.forFeature([InputFlowOnlyCode, InputFlowOnlyCodeInput]),
  ],
  providers: [InputFlowOnlyCodeService],
  exports: [SequelizeModule, InputFlowOnlyCodeService],
})
export class InputFlowOnlyCodeModule {}
