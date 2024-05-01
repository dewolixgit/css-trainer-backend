import { TaskOfSetDto } from './TaskOfSet.dto';

export class TaskOfSetProgressDto {
  data: TaskOfSetDto;
  completed: boolean;
  order: number;
}
