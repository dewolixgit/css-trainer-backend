export enum ToClientTopicDtoTypeEnum {
  tasksSet = 'tasks-set',
  topic = 'topic',
}

export class ToClientTopicDto {
  id: number;
  name: string;
  description: string;
  backgroundImage: string;
  completed: boolean;
  type: ToClientTopicDtoTypeEnum;
  parentTopicId: number | null;
  order: number;
}
