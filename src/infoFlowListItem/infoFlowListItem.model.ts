import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InfoFlowListBlock } from '../infoFlowListBlock/infoFlowListBlock.model';
import { ToPartial } from '../types/utils';

export type InfoFlowListItemAttributes = Pick<
  InfoFlowListItem,
  'id' | 'text' | 'order' | 'flowBlockId'
>;

export type InfoFlowListItemCreationAttributes = Omit<
  InfoFlowListItemAttributes,
  'id' | 'order'
> &
  ToPartial<InfoFlowListItemAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class InfoFlowListItem extends Model<
  InfoFlowListItemAttributes,
  InfoFlowListItemCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly text: string;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => InfoFlowListBlock)
  readonly flowBlockId: number;

  @BelongsTo(() => InfoFlowListBlock)
  readonly flowBlock: InfoFlowListBlock;
}
