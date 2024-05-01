import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PartCodeOnlyRow } from './partCodeOnlyRow.model';
import { PartCodeOnlyRowInput } from '../partCodeOnlyRowInput/partCodeOnlyRowInput.model';
import { PartCodeOnlyRowService } from './partCodeOnlyRow.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PartCodeOnlyRow, PartCodeOnlyRowInput]),
  ],
  providers: [PartCodeOnlyRowService],
  exports: [SequelizeModule, PartCodeOnlyRowService],
})
export class PartCodeOnlyRowModule {}
