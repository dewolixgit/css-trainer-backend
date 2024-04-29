import {
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users';
import { InputFlowDndOption } from '../inputFlowDndOption';
import { InputFlowDndOptionInput } from '../inputFlowDndOptionInput';
import { InputFlowDnd } from '../inputFlowDnd';

export type InputFlowDndInputAttributes = Pick<
  InputFlowDndInput,
  'id' | 'inputFlowId' | 'userId'
>;

export type InputFlowDndInputCreationAttributes = Omit<
  InputFlowDndInputAttributes,
  'id'
>;

@Table({ freezeTableName: true, timestamps: false })
export class InputFlowDndInput extends Model<
  InputFlowDndInputAttributes,
  InputFlowDndInputCreationAttributes
> {
  @Column({ primaryKey: true, autoIncrement: true })
  readonly id: number;

  @Column
  @ForeignKey(() => InputFlowDnd)
  readonly inputFlowId: number;

  @Column
  @ForeignKey(() => User)
  readonly userId: number;

  @BelongsToMany(() => InputFlowDndOption, () => InputFlowDndOptionInput)
  readonly inputFlowDndOptions: InputFlowDndOption[];
}
