import { TaskSkill } from '../../tasks/tasks.model';

export class TaskOfSetDto {
  id: number;
  skillTag: TaskSkill;
  topicId: number;
  name: string;
}
