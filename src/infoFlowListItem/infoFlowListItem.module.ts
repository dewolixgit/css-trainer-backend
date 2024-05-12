import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InfoFlowListItem } from './infoFlowListItem.model';
import { InfoFlowListItemService } from './infoFlowListItem.service';

@Module({
  imports: [SequelizeModule.forFeature([InfoFlowListItem])],
  providers: [InfoFlowListItemService],
  exports: [InfoFlowListItemService, SequelizeModule],
})
export class InfoFlowListItemModule {}
