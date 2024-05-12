import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowListItemService } from '../infoFlowListItem/infoFlowListItem.service';
import { InfoFlowListItemModule } from '../infoFlowListItem/infoFlowListItem.module';
import { InfoFlowListBlockService } from './infoFlowListBlock.service';
import { InfoFlowListBlock } from './infoFlowListBlock.model';

@Module({
  imports: [
    SequelizeModule.forFeature([InfoFlowListBlock]),
    InfoFlowListItemModule,
  ],
  providers: [InfoFlowListBlockService, InfoFlowListItemService],
  exports: [SequelizeModule, InfoFlowListBlockService, InfoFlowListItemService],
})
export class InfoFlowListBlockModule {}
