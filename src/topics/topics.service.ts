import { Injectable } from '@nestjs/common';
import {
  ToClientTopicDto,
  ToClientTopicDtoTypeEnum,
} from './dto/ToClientTopic.dto';
import { TasksSetsService } from '../tasksSets/tasksSets.service';
import { User } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Topic } from './topics.model';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic) private readonly _topicsModel: typeof Topic,
    private readonly _tasksSetsService: TasksSetsService,
  ) {}

  async getAllTopicsAndTasksSetsWithoutTopic(params: {
    userId: User['id'];
  }): Promise<ToClientTopicDto[]> {
    const topics = await this._topicsModel.findAll();

    const getTopicsWithProgressPromises = topics.map<Promise<ToClientTopicDto>>(
      async (topic): Promise<ToClientTopicDto> => {
        const topicTasksSetsWithProgress =
          await this._tasksSetsService.getAllWithProgress({
            userId: params.userId,
            topicId: topic.id,
          });

        const commonTopicData: Omit<ToClientTopicDto, 'completed'> = {
          id: topic.id,
          name: topic.name,
          description: topic.description,
          backgroundImage: topic.image,
          type: ToClientTopicDtoTypeEnum.topic,
          parentTopicId: null,
          order: topic.order,
        };

        if (
          topicTasksSetsWithProgress.some(
            (topicTasksSet) => !topicTasksSet.completed,
          )
        ) {
          return {
            ...commonTopicData,
            completed: false,
          };
        }

        return {
          ...commonTopicData,
          completed: true,
        };
      },
    );

    const topicsWithProgress = await Promise.all(getTopicsWithProgressPromises);

    const tasksSetsNoParentTopic = (
      await this._tasksSetsService.getAllWithProgress({
        userId: params.userId,
        topicId: null,
      })
    ).map<ToClientTopicDto>((tasksSetWithProgress) => ({
      id: tasksSetWithProgress.id,
      name: tasksSetWithProgress.name,
      description: tasksSetWithProgress.description,
      backgroundImage: tasksSetWithProgress.backgroundImage,
      completed: tasksSetWithProgress.completed,
      order: tasksSetWithProgress.order,
      type: ToClientTopicDtoTypeEnum.tasksSet,
      parentTopicId: null,
    }));

    return [...topicsWithProgress, ...tasksSetsNoParentTopic].sort(
      (a, b) => a.order - b.order,
    );
  }
}
