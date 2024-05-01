import { TasksSetProgressDto } from './TasksSetProgress.dto';
import {
  ContentFlowBlocksDtoUnion,
  InfoFlowBlocksDtoUnion,
} from '../../tasks/types';
import { TaskOfSetProgressDto } from './TaskOfSetProgress.dto';

export class TasksSetProgressAndTaskDetailsDto {
  tasksSetStatus: TasksSetProgressDto;
  theory: {
    content: InfoFlowBlocksDtoUnion[];
  } | null;
  practice: {
    content: ContentFlowBlocksDtoUnion[];
    task: TaskOfSetProgressDto;
  } | null;
}
