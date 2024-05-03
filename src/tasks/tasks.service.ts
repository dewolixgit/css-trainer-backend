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
import {
  SaveUserInputItemPayloadDto,
  SaveUserInputPayloadDto,
  SaveUserInputResponseDto,
  userInputTextTypes,
  UserInputTypeEnum,
} from './dto/SaveUserInputPayload.dto';
import {
  ServicePromiseHttpResponse,
  ServiceResponse,
} from '../types/ServiceResponse';
import { HttpStatus } from '@nestjs/common/enums';
import { PartCodeMixedRowCodeElementService } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.service';
import { PartCodeOnlyRowService } from '../partCodeOnlyRow/partCodeOnlyRow.service';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly _achievementService: AchievementsService,
    private readonly _infoFlowTextBlockService: InfoFlowTextBlockService,
    private readonly _infoFlowImageBlockService: InfoFlowImageBlockService,
    private readonly _infoFlowCodeBlockService: InfoFlowCodeBlockService,
    private readonly _inputFlowOnlyCodeService: InputFlowOnlyCodeService,
    private readonly _inputFlowPartCodeService: InputFlowPartCodeService,
    private readonly _partCodeMixedRowCodeElementService: PartCodeMixedRowCodeElementService,
    private readonly _partCodeOnlyRowService: PartCodeOnlyRowService,
    private readonly _inputFlowDndService: InputFlowDndService,
    @InjectModel(Task) private readonly _taskModel: typeof Task,
    @InjectModel(TaskStatus)
    private readonly _taskStatusModel: typeof TaskStatus,
  ) {}

  async getByPk(id: Task['id']): Promise<Task | null> {
    return await this._taskModel.findByPk(id);
  }

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

  async getTasksSections(params: {
    userId: User['id'];
    taskId: Task['id'];
  }): Promise<{
    theory: InfoFlowBlocksDtoUnion[];
    practice: ContentFlowBlocksDtoUnion[];
  }> {
    const [theory, practice] = await Promise.all([
      this.getAllTheorySectionFlowBlocks({
        taskId: params.taskId,
      }),
      this.getAllPracticeSectionFlowBlocks({
        taskId: params.taskId,
        userId: params.userId,
      }),
    ]);

    return {
      practice,
      theory,
    };
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

  validateSaveUserInput(params: {
    payload: SaveUserInputItemPayloadDto;
  }): ServiceResponse<undefined, string> {
    if (
      (params.payload.value === undefined || params.payload.value === null) &&
      userInputTextTypes.includes(params.payload.inputType)
    ) {
      return {
        isError: true,
        data: `Input value is required when saving any of text inputs: ${userInputTextTypes.join(', ')}`,
      };
    }

    if (
      (params.payload.order === undefined ||
        params.payload.order === null ||
        !params.payload.order.length) &&
      params.payload.inputType === UserInputTypeEnum.inputFlowDnd
    ) {
      return {
        isError: true,
        data: `Drag and drop options array is required when saving drag and drop input`,
      };
    }

    return {
      isError: false,
    };
  }

  private async _saveUserInputByType(params: {
    inputType: UserInputTypeEnum;
    userId: User['id'];
    payload: SaveUserInputItemPayloadDto;
  }): ServicePromiseHttpResponse {
    if (params.payload.inputType === UserInputTypeEnum.inputFlowOnlyCode) {
      return await this._inputFlowOnlyCodeService.saveInputIfExists({
        userId: params.userId,
        inputFlowId: params.payload.inputId,
        value: params.payload.value ?? '',
      });
    }

    if (params.payload.inputType === UserInputTypeEnum.partCodeOnlyRow) {
      return await this._partCodeOnlyRowService.saveInputIfExists({
        userId: params.userId,
        rowId: params.payload.inputId,
        value: params.payload.value ?? '',
      });
    }

    if (
      params.payload.inputType === UserInputTypeEnum.partCodeMixedRowCodeElement
    ) {
      return await this._partCodeMixedRowCodeElementService.saveInputIfExists({
        userId: params.userId,
        rowElementId: params.payload.inputId,
        value: params.payload.value ?? '',
      });
    }

    if (params.payload.inputType === UserInputTypeEnum.inputFlowDnd) {
      return this._inputFlowDndService.saveInputIfExists({
        userId: params.userId,
        dndInputFlowId: params.payload.inputId,
        order: params.payload.order ?? [],
      });
    }

    return {
      isError: true,
      data: {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Unhandled input type: ${params.payload.inputType}`,
      },
    };
  }

  private async _saveCompleteState(params: {
    userId: User['id'];
    taskId: Task['id'];
    completed: boolean;
  }): ServicePromiseHttpResponse<{ task: Task }> {
    const task = await this.getByPk(params.taskId);

    if (!task) {
      return {
        isError: true,
        data: {
          code: HttpStatus.NOT_FOUND,
          message: `Task with id ${params.taskId} not found`,
        },
      };
    }

    const [input] = await this._taskStatusModel.findOrCreate({
      where: {
        userId: params.userId,
        taskId: params.taskId,
      },
    });

    if (!input.completed && params.completed) {
      await input.update({
        completed: params.completed,
      });
    }

    return {
      isError: false,
      data: {
        task,
      },
    };
  }

  /**
   * There is no checking if the task has inputs we are editing
   */
  async saveUserInput(params: {
    userId: User['id'];
    payload: SaveUserInputPayloadDto;
  }): ServicePromiseHttpResponse<undefined | SaveUserInputResponseDto> {
    const savingResults = await Promise.all(
      params.payload.inputItems.map((input) =>
        this._saveUserInputByType({
          inputType: input.inputType,
          userId: params.userId,
          payload: input,
        }),
      ),
    );

    const anySavingResultError = savingResults.find((result) => result.isError);

    if (anySavingResultError && anySavingResultError.isError) {
      return anySavingResultError;
    }

    if (params.payload.completedFirstly && params.payload.completed) {
      const saveCompleteStateResult = await this._saveCompleteState({
        taskId: params.payload.taskId,
        userId: params.userId,
        completed: params.payload.completed,
      });

      if (saveCompleteStateResult.isError) {
        return saveCompleteStateResult;
      }

      const [achievementsToGet, tasksStatuses] = await Promise.all([
        this._achievementService.checkAchievementsDto({
          userId: params.userId,
        }),
        this.getAllTasksProgressOrdered({
          userId: params.userId,
          tasksSetId: saveCompleteStateResult.data.task.tasksSetId,
        }),
      ]);

      return {
        isError: false,
        data: {
          completed: true,
          tasksStatuses,
          achievements: achievementsToGet,
        },
      };
    }

    return {
      isError: false,
    };
  }
}
