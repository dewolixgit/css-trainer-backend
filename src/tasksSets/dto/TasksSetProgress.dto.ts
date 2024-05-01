import { TaskOfSetProgressDto } from './TaskOfSetProgress.dto';
import { TasksSet } from '../tasksSets.model';

export class TasksSetProgressDto {
  id: TasksSet['id'];
  parentTopicId: TasksSet['topicId'] | null;
  tasksStatus: TaskOfSetProgressDto[];
}
