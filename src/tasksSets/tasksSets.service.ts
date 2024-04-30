import { Injectable } from '@nestjs/common';
import { TasksSet } from './tasksSets.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Task } from '../tasks/tasks.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { TasksSetWithProgressDto } from './dto/tasksSetWithProgress.dto';
import { Topic } from '../topics/topics.model';

@Injectable()
export class TasksSetsService {
  constructor(
    @InjectModel(TasksSet) private readonly _tasksSetsModel: typeof TasksSet,
    @InjectModel(Task) private readonly _tasksModel: typeof Task,
    @InjectModel(TaskStatus)
    private readonly _taskStatusesModel: typeof TaskStatus,
  ) {}

  async getAllWithProgress(params: {
    userId: User['id'];
    topicId: Topic['id'] | null;
  }): Promise<TasksSetWithProgressDto[]> {
    const sets = await this._tasksSetsModel.findAll({
      include: [Task],
      where: { topicId: params.topicId },
    });

    if (!sets.length) {
      return [];
    }

    const getTasksWithProgressPromises = sets.map<
      Promise<TasksSetWithProgressDto>
    >(async (tasksSet): Promise<TasksSetWithProgressDto> => {
      const allSetTasksIds = tasksSet.tasks.map((task) => task.id);

      const setTasksStatuses = await this._taskStatusesModel.findAll({
        where: {
          taskId: allSetTasksIds,
          userId: params.userId,
        },
      });

      const commonTaskStatusData: Omit<TasksSetWithProgressDto, 'completed'> = {
        id: tasksSet.id,
        name: tasksSet.name,
        description: tasksSet.description,
        order: tasksSet.order,
        backgroundImage: tasksSet.image,
        parentTopicId: tasksSet.topicId,
      };

      if (
        setTasksStatuses.length < tasksSet.tasks.length ||
        setTasksStatuses.some((task) => !task.completed)
      ) {
        return {
          ...commonTaskStatusData,
          completed: false,
        };
      }

      return {
        ...commonTaskStatusData,
        completed: true,
      };
    });

    return await Promise.all(getTasksWithProgressPromises);
  }
}
