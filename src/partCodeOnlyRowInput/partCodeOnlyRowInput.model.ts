import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { PartCodeOnlyRow } from '../partCodeOnlyRow/partCodeOnlyRow.model';
import { User } from '../users/users.model';

export type PartCodeOnlyRowInputAttributes = Pick<
  PartCodeOnlyRowInput,
  'id' | 'rowId' | 'userId'
>;

export type PartCodeOnlyRowCreationAttributes = Omit<
  PartCodeOnlyRowInputAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class PartCodeOnlyRowInput extends Model<
  PartCodeOnlyRowInputAttributes,
  PartCodeOnlyRowCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  @ForeignKey(() => PartCodeOnlyRow)
  readonly rowId: number;

  @Column
  @ForeignKey(() => User)
  readonly userId: number;
}
