export class TasksSetWithProgressDto {
  id: number;
  name: string;
  description: string;
  backgroundImage: string;
  order: number;
  parentTopicId: number | null;
  completed: boolean;
}
