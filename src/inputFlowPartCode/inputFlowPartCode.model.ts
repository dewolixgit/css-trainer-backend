import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from '../tasks/tasks.model';
import { PartCodeOnlyRow } from '../partCodeOnlyRow/partCodeOnlyRow.model';
import { PartCodeMixedRow } from '../partCodeMixedRow/partCodeMixedRow.model';
import { ToPartial } from '../types/utils';

type InputFlowPartCodeAttributes = Pick<
  InputFlowPartCode,
  'id' | 'order' | 'taskId'
>;

export type InputFlowPartCodeCreationAttributes = Omit<
  InputFlowPartCodeAttributes,
  'id' | 'order'
> &
  ToPartial<InputFlowPartCodeAttributes, 'order'>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowPartCode extends Model<
  InputFlowPartCodeAttributes,
  InputFlowPartCodeCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column({ defaultValue: 0 })
  readonly order: number;

  @Column
  @ForeignKey(() => Task)
  readonly taskId: number;

  @BelongsTo(() => Task)
  readonly task: Task;

  @HasMany(() => PartCodeOnlyRow)
  readonly partCodeOnlyRows: PartCodeOnlyRow[];

  @HasMany(() => PartCodeMixedRow)
  readonly partCodeMixedRows: PartCodeMixedRow[];
}
