import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { PartCodeMixedRow } from '../partCodeMixedRow/partCodeMixedRow.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { User } from '../users/users.model';
import { ToPartial } from '../types/utils';

export type PartCodeMixedRowCodeElementAttributes = Pick<
  PartCodeMixedRowCodeElement,
  'id' | 'symbolsLength' | 'order' | 'rowId'
>;

export type PartCodeMixedRowCodeElementCreationAttributes = Omit<
  PartCodeMixedRowCodeElementAttributes,
  'id' | 'order'
> &
  ToPartial<PartCodeMixedRowCodeElementAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class PartCodeMixedRowCodeElement extends Model<
  PartCodeMixedRowCodeElementAttributes,
  PartCodeMixedRowCodeElementCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly symbolsLength: number;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => PartCodeMixedRow)
  readonly rowId: number;

  @BelongsTo(() => PartCodeMixedRow)
  readonly row: PartCodeMixedRow;

  @BelongsToMany(() => User, () => PartCodeMixedRowCodeElementInput)
  readonly users: User[];
}
