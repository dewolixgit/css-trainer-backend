import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PartCodeMixedRow } from './partCodeMixedRow.model';
import { PartCodeMixedRowService } from './partCodeMixedRow.service';
import { PartCodeMixedRowCodeElementModule } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.module';
import { PartCodeMixedRowTextElementModule } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.module';
import { PartCodeMixedRowCodeElementService } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PartCodeMixedRow]),
    PartCodeMixedRowCodeElementModule,
    PartCodeMixedRowTextElementModule,
  ],
  providers: [
    PartCodeMixedRowService,
    PartCodeMixedRowCodeElementService,
    PartCodeMixedRowTextElementModule,
  ],
  exports: [SequelizeModule, PartCodeMixedRowService],
})
export class PartCodeMixedRowModule {}
