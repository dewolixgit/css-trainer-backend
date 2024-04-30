import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowTextBlockService } from './infoFlowTextBlock.service';
import { Module } from '@nestjs/common';
import { InfoFlowTextBlock } from './infoFlowTextBlock.model';

@Module({
  imports: [SequelizeModule.forFeature([InfoFlowTextBlock])],
  providers: [InfoFlowTextBlockService],
  exports: [InfoFlowTextBlockService, SequelizeModule],
})
export class InfoFlowTextBlockModule {}
