import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import {
  ContentFlowBlocksDtoUnion,
  InfoFlowBlocksDtoUnion,
  TaskSectionEnum,
} from './types';
import { User } from '../users/users.model';
import { InputFlowOnlyCodeService } from '../inputFlowOnlyCode/inputFlowOnlyCode.service';
import { InfoFlowTextBlockService } from '../infoFlowTextBlock/infoFlowTextBlock.service';
import { InfoFlowImageBlockService } from '../infoFlowImageBlock/infoFlowImageBlock.service';
import { InfoFlowCodeBlockService } from '../infoFlowCodeBlock/infoFlowCodeBlock.service';
import { InputFlowPartCodeService } from '../inputFlowPartCode/inputFlowPartCode.service';
import { InputFlowDndService } from '../inputFlowDnd/inputFlowDnd.service';
import { TasksSet } from '../tasksSets/tasksSets.model';
import { TaskOfSetProgressDto } from '../tasksSets/dto/TaskOfSetProgress.dto';
import { TaskStatus } from '../taskStatus/taskStatus.model';

@Injectable()
export class TasksService {
  constructor(
    private readonly _infoFlowTextBlockService: InfoFlowTextBlockService,
    private readonly _infoFlowImageBlockService: InfoFlowImageBlockService,
    private readonly _infoFlowCodeBlockService: InfoFlowCodeBlockService,
    private readonly _inputFlowOnlyCodeService: InputFlowOnlyCodeService,
    private readonly _inputFlowPartCodeService: InputFlowPartCodeService,
    private readonly _inputFlowDndService: InputFlowDndService,
    @InjectModel(Task) private readonly _taskModel: typeof Task,
    @InjectModel(TaskStatus)
    private readonly _taskStatusModel: typeof TaskStatus,
  ) {}

  private async _getAllInfoFlowBlocks(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowBlocksDtoUnion[]> {
    const promises = [
      await this._infoFlowTextBlockService.getAllInfoFlowTextBlocks({
        taskId: params.taskId,
        section: params.section,
      }),
      await this._infoFlowImageBlockService.getAllInfoFlowImageBlocks({
        taskId: params.taskId,
        section: params.section,
      }),
      await this._infoFlowCodeBlockService.getAllInfoFlowCodeBlocks({
        taskId: params.taskId,
        section: params.section,
      }),
    ];

    return (await Promise.all(promises)).flat();
  }

  async getAllTheorySectionFlowBlocks(params: {
    taskId: Task['id'];
  }): Promise<InfoFlowBlocksDtoUnion[]> {
    return (
      await this._getAllInfoFlowBlocks({
        taskId: params.taskId,
        section: TaskSectionEnum.theory,
      })
    ).sort((block1, block2) => block1.order - block2.order);
  }

  async getAllPracticeSectionFlowBlocks(params: {
    taskId: Task['id'];
    userId: User['id'];
  }): Promise<ContentFlowBlocksDtoUnion[]> {
    const promises = [
      this._getAllInfoFlowBlocks({
        taskId: params.taskId,
        section: TaskSectionEnum.practice,
      }),
      this._inputFlowOnlyCodeService.getAllInputFlowOnlyCodeBlocksWithUserInput(
        {
          taskId: params.taskId,
          userId: params.userId,
        },
      ),
      this._inputFlowPartCodeService.getAllInputFlowPartCodeWithUserInput({
        taskId: params.taskId,
        userId: params.userId,
      }),
      this._inputFlowDndService.getAllInputFlowDndWithUserInput({
        taskId: params.taskId,
        userId: params.userId,
      }),
    ];

    return (await Promise.all(promises))
      .flat()
      .sort((block1, block2) => block1.order - block2.order);
  }

  async getAllTasksProgressOrdered(params: {
    userId: User['id'];
    tasksSetId: TasksSet['id'];
  }): Promise<TaskOfSetProgressDto[]> {
    const tasks = await this._taskModel.findAll({
      where: {
        tasksSetId: params.tasksSetId,
      },
    });

    if (!tasks.length) {
      return [];
    }

    const getTasksWithProgressPromises = tasks.map<
      Promise<TaskOfSetProgressDto>
    >(async (task): Promise<TaskOfSetProgressDto> => {
      const taskProgress = await this._taskStatusModel.findOne({
        where: {
          taskId: task.id,
          userId: params.userId,
        },
      });

      return {
        data: {
          id: task.id,
          skillTag: task.skill,
          topicId: task.tasksSetId,
          name: task.name,
        },
        order: task.order,
        completed: taskProgress?.completed ?? false,
      };
    });

    return (await Promise.all(getTasksWithProgressPromises)).sort(
      (task1, task2) => task1.order - task2.order,
    );
  }
}
