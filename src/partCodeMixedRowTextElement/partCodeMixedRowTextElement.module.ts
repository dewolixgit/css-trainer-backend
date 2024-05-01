import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PartCodeMixedRowTextElement } from './partCodeMixedRowTextElement.model';
import { PartCodeMixedRowTextElementService } from './partCodeMixedRowTextElement.service';

@Module({
  imports: [SequelizeModule.forFeature([PartCodeMixedRowTextElement])],
  providers: [PartCodeMixedRowTextElementService],
  exports: [PartCodeMixedRowTextElementService, SequelizeModule],
})
export class PartCodeMixedRowTextElementModule {}
