import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PartCodeMixedRowCodeElementService } from './partCodeMixedRowCodeElement.service';
import { PartCodeMixedRowCodeElement } from './partCodeMixedRowCodeElement.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PartCodeMixedRowCodeElement,
      PartCodeMixedRowCodeElementInput,
    ]),
  ],
  providers: [PartCodeMixedRowCodeElementService],
  exports: [PartCodeMixedRowCodeElementService, SequelizeModule],
})
export class PartCodeMixedRowCodeElementModule {}
