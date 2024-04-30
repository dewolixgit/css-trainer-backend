import { InfoFlowImageBlock } from './infoFlowImageBlock.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowImageBlockService } from './infoFlowImageBlock.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [SequelizeModule.forFeature([InfoFlowImageBlock])],
  providers: [InfoFlowImageBlockService],
  exports: [InfoFlowImageBlockService, SequelizeModule],
})
export class InfoFlowImageBlockModule {}
