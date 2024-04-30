import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.model';

export type PartCodeMixedRowCodeElementInputAttributes = Pick<
  PartCodeMixedRowCodeElementInput,
  'id' | 'value' | 'rowElementId' | 'userId'
>;

export type PartCodeMixedRowCodeElementInputCreationAttributes = Omit<
  PartCodeMixedRowCodeElementInputAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class PartCodeMixedRowCodeElementInput extends Model<
  PartCodeMixedRowCodeElementInputAttributes,
  PartCodeMixedRowCodeElementInputCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly value: string;

  @Column
  @ForeignKey(() => PartCodeMixedRowCodeElement)
  readonly rowElementId: number;

  @Column
  @ForeignKey(() => User)
  readonly userId: number;
}
