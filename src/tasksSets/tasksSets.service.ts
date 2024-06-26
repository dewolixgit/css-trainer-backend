import { HttpStatus } from '@nestjs/common/enums';
import { Inject, Injectable, HttpException } from '@nestjs/common';
import { TasksSet } from './tasksSets.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Task } from '../tasks/tasks.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { TasksSetWithProgressDto } from './dto/TasksSetWithProgress.dto';
import { Topic } from '../topics/topics.model';
import { TasksService } from '../tasks/tasks.service';
import { TaskOfSetProgressDto } from './dto/TaskOfSetProgress.dto';
import { TasksSetProgressAndTaskDetailsDto } from './dto/TasksSetProgressAndTaskDetails.dto';
import { TasksSetProgressDto } from './dto/TasksSetProgress.dto';
import { TRIAL_TASKS_SET_ID } from './config';

@Injectable()
export class TasksSetsService {
  constructor(
    @Inject(TasksService)
    private readonly _tasksService: TasksService,
    @InjectModel(TasksSet) private readonly _tasksSetsModel: typeof TasksSet,
    @InjectModel(TaskStatus)
    private readonly _taskStatusesModel: typeof TaskStatus,
  ) {}

  async getAllWithProgress(params: {
    userId: User['id'];
    topicId?: Topic['id'] | null;
  }): Promise<TasksSetWithProgressDto[]> {
    const sets = await this._tasksSetsModel.findAll({
      include: [Task],
      where:
        params.topicId !== undefined ? { topicId: params.topicId } : undefined,
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

  private async _getTasksSetProgressDto(params: {
    userId: User['id'] | null;
    tasksSetId: TasksSet['id'];
  }): Promise<TasksSetProgressDto | null> {
    const tasksSet = await this._tasksSetsModel.findOne({
      where: {
        id: params.tasksSetId,
      },
    });

    if (!tasksSet) {
      return null;
    }

    const tasksWithProgressOrdered =
      await this._tasksService.getAllTasksProgressOrdered({
        userId: params.userId,
        tasksSetId: params.tasksSetId,
      });

    return {
      id: tasksSet.id,
      parentTopicId: tasksSet.topicId,
      tasksStatus: tasksWithProgressOrdered,
    };
  }

  /**
   * Returns the first not completed task within ordered tasks of the set
   * Is expected to receive non-empty array
   */
  private _getTaskToOpenWithinTasksWithProgress(
    tasksSetProgress: TaskOfSetProgressDto[],
  ): TaskOfSetProgressDto {
    const firstUncompletedTask = tasksSetProgress.findIndex(
      (task) => !task.completed,
    );

    // All tasks are completed
    if (firstUncompletedTask === -1) {
      return tasksSetProgress[tasksSetProgress.length - 1];
    }

    return tasksSetProgress[firstUncompletedTask];
  }

  async getTasksSetProgressAndTaskContent(params: {
    userId: User['id'];
    tasksSetId: TasksSet['id'];
    taskIdToOpen?: Task['id'];
  }): Promise<TasksSetProgressAndTaskDetailsDto | null> {
    const tasksSetProgress = await this._getTasksSetProgressDto({
      userId: params.userId,
      tasksSetId: params.tasksSetId,
    });

    if (!tasksSetProgress) {
      return null;
    }

    if (!tasksSetProgress.tasksStatus.length) {
      return {
        tasksSetStatus: tasksSetProgress,
        theory: null,
        practice: null,
      };
    }

    const taskToOpen = params.taskIdToOpen
      ? tasksSetProgress.tasksStatus.find(
          (task) => task.data.id === params.taskIdToOpen,
        )
      : this._getTaskToOpenWithinTasksWithProgress(
          tasksSetProgress.tasksStatus,
        );

    if (!taskToOpen) {
      return {
        tasksSetStatus: tasksSetProgress,
        theory: null,
        practice: null,
      };
    }

    const sections = await this._tasksService.getTasksSections({
      userId: params.userId,
      taskId: taskToOpen.data.id,
    });

    return {
      tasksSetStatus: tasksSetProgress,
      theory: {
        content: sections.theory,
      },
      practice: {
        content: sections.practice,
        task: taskToOpen,
      },
    };
  }

  async getTrialTasksSetProgressAndTaskContent(params: {
    taskIdToOpen?: Task['id'];
  }): Promise<TasksSetProgressAndTaskDetailsDto | null> {
    const tasksSetProgress = await this._getTasksSetProgressDto({
      userId: null,
      tasksSetId: TRIAL_TASKS_SET_ID,
    });

    if (!tasksSetProgress) {
      throw new HttpException(
        'The trial tasks set not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!tasksSetProgress.tasksStatus.length) {
      return {
        tasksSetStatus: tasksSetProgress,
        theory: null,
        practice: null,
      };
    }

    const taskToOpen = params.taskIdToOpen
      ? tasksSetProgress.tasksStatus.find(
          (task) => task.data.id === params.taskIdToOpen,
        )
      : tasksSetProgress.tasksStatus[0];

    if (!taskToOpen) {
      return {
        tasksSetStatus: tasksSetProgress,
        theory: null,
        practice: null,
      };
    }

    const sections = await this._tasksService.getTasksSections({
      userId: null,
      taskId: taskToOpen.data.id,
    });

    return {
      tasksSetStatus: tasksSetProgress,
      theory: {
        content: sections.theory,
      },
      practice: {
        content: sections.practice,
        task: taskToOpen,
      },
    };
  }
}
