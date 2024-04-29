import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { PartCodeMixedRow } from '../partCodeMixedRow';
import { ToPartial } from '../types/utils';

export type PartCodeMixedRowTextElementAttributes = Pick<
  PartCodeMixedRowTextElement,
  'id' | 'text' | 'order' | 'rowId'
>;

export type PartCodeMixedRowTextElementCreationAttributes = Omit<
  PartCodeMixedRowTextElementAttributes,
  'id' | 'order'
> &
  ToPartial<PartCodeMixedRowTextElementAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class PartCodeMixedRowTextElement extends Model<
  PartCodeMixedRowTextElementAttributes,
  PartCodeMixedRowTextElementCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly text: string;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => PartCodeMixedRow)
  readonly rowId: number;

  @BelongsTo(() => PartCodeMixedRow)
  readonly row: PartCodeMixedRow;
}
