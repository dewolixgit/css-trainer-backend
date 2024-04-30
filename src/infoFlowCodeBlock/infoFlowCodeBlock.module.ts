import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowCodeBlockService } from './infoFlowCodeBlock.service';
import { Module } from '@nestjs/common';
import { InfoFlowCodeBlock } from './infoFlowCodeBlock.model';

@Module({
  imports: [SequelizeModule.forFeature([InfoFlowCodeBlock])],
  providers: [InfoFlowCodeBlockService],
  exports: [InfoFlowCodeBlockService, SequelizeModule],
})
export class InfoFlowCodeBlockModule {}
