import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InputFlowPartCode } from '../inputFlowPartCode/inputFlowPartCode.model';
import { PartCodeOnlyRowInput } from '../partCodeOnlyRowInput/partCodeOnlyRowInput.model';
import { User } from '../users/users.model';
import { ToPartial } from '../types/utils';

export type PartCodeOnlyRowAttributes = Pick<
  PartCodeOnlyRow,
  'id' | 'linesHeight' | 'order' | 'tabs' | 'inputFlowId'
>;

export type PartCodeOnlyRowCreationAttributes = Omit<
  PartCodeOnlyRowAttributes,
  'id' | 'order'
> &
  ToPartial<PartCodeOnlyRowAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class PartCodeOnlyRow extends Model<
  PartCodeOnlyRowAttributes,
  PartCodeOnlyRowCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly linesHeight: number;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  readonly tabs: number;

  @Column
  @ForeignKey(() => InputFlowPartCode)
  readonly inputFlowId: number;

  @BelongsTo(() => InputFlowPartCode)
  readonly inputFlow: InputFlowPartCode;

  @BelongsToMany(() => User, () => PartCodeOnlyRowInput)
  readonly users: User;
}
