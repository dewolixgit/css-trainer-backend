import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InputFlowPartCode } from './inputFlowPartCode.model';
import { PartCodeMixedRowService } from '../partCodeMixedRow/partCodeMixedRow.service';
import { PartCodeOnlyRowService } from '../partCodeOnlyRow/partCodeOnlyRow.service';
import { InputFlowPartCodeService } from './inputFlowPartCode.service';
import { PartCodeMixedRowModule } from '../partCodeMixedRow/partCodeMixedRow.module';
import { PartCodeOnlyRowModule } from '../partCodeOnlyRow/partCodeOnlyRow.module';

@Module({
  imports: [
    SequelizeModule.forFeature([InputFlowPartCode]),
    PartCodeMixedRowModule,
    PartCodeOnlyRowModule,
  ],
  providers: [
    InputFlowPartCodeService,
    PartCodeMixedRowService,
    PartCodeOnlyRowService,
  ],
  exports: [SequelizeModule, InputFlowPartCodeService, PartCodeMixedRowService],
})
export class InputFlowPartCodeModule {}
