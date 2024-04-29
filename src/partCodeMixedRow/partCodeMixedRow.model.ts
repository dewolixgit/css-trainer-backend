import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { InputFlowPartCode } from '../inputFlowPartCode';
import { PartCodeMixedRowTextElement } from '../partCodeMixedRowTextElement';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement';
import { ToPartial } from '../types/utils';

export type PartCodeOnlyRowInputAttributes = Pick<
  PartCodeMixedRow,
  'id' | 'tabs' | 'order' | 'inputFlowId'
>;

export type PartCodeOnlyRowInputCreationAttributes = Omit<
  PartCodeOnlyRowInputAttributes,
  'id' | 'order'
> &
  ToPartial<PartCodeOnlyRowInputAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class PartCodeMixedRow extends Model<
  PartCodeOnlyRowInputAttributes,
  PartCodeOnlyRowInputCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  readonly tabs: number;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => InputFlowPartCode)
  readonly inputFlowId: number;

  @BelongsTo(() => InputFlowPartCode)
  readonly inputFlow: InputFlowPartCode;

  @HasMany(() => PartCodeMixedRowTextElement)
  readonly textElements: PartCodeMixedRowTextElement[];

  @HasMany(() => PartCodeMixedRowCodeElement)
  readonly codeElements: PartCodeMixedRowCodeElement[];
}
