import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksSetsService } from './tasksSets.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { AuthenticatedRequest } from '../auth/types';
import {
  ToClientTopicDto,
  ToClientTopicDtoTypeEnum,
} from '../topics/dto/ToClientTopic.dto';
import { Topic } from '../topics/topics.model';
import { TasksSet } from './tasksSets.model';
import { TasksSetProgressAndTaskDetailsDto } from './dto/TasksSetProgressAndTaskDetails.dto';
import { Task } from '../tasks/tasks.model';
import { TopicsService } from '../topics/topics.service';

@Controller('tasks-sets')
export class TasksSetsController {
  constructor(
    private readonly _tasksSetsService: TasksSetsService,
    @Inject(TopicsService)
    private readonly _topicsService: TopicsService,
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllWithProgress(
    @Req() request: AuthenticatedRequest,
    @Query('topic-id', ParseIntPipe) topicId: Topic['id'],
  ): Promise<{ tasksSets: ToClientTopicDto[]; parentTopicName: string }> {
    const [parentTopic, tasksSets] = await Promise.all([
      this._topicsService.getByPk({
        id: topicId,
      }),
      this._tasksSetsService.getAllWithProgress({
        userId: request.user.userId,
        topicId,
      }),
    ]);

    if (!parentTopic) {
      throw new NotFoundException();
    }

    return {
      tasksSets: tasksSets
        .map((tasksSet) => ({
          id: tasksSet.id,
          name: tasksSet.name,
          description: tasksSet.description,
          backgroundImage: tasksSet.backgroundImage,
          order: tasksSet.order,
          parentTopicId: tasksSet.parentTopicId,
          completed: tasksSet.completed,
          type: ToClientTopicDtoTypeEnum.tasksSet,
        }))
        .sort((a, b) => a.order - b.order),
      parentTopicName: parentTopic.name,
    };
  }

  @Get('/progress/trial')
  async getTrialTasksSetProgressAndTaskContent(
    @Query('task-id', new ParseIntPipe({ optional: true })) taskId?: Task['id'],
  ): Promise<TasksSetProgressAndTaskDetailsDto | null> {
    return this._tasksSetsService.getTrialTasksSetProgressAndTaskContent({
      taskIdToOpen: taskId,
    });
  }

  @Get('progress/:id')
  @UseGuards(JwtAuthGuard)
  async getTasksSetProgressAndTaskContent(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: TasksSet['id'],
    @Query('task-id', new ParseIntPipe({ optional: true })) taskId?: Task['id'],
  ): Promise<TasksSetProgressAndTaskDetailsDto | null> {
    return this._tasksSetsService.getTasksSetProgressAndTaskContent({
      tasksSetId: id,
      userId: request.user.userId,
      taskIdToOpen: taskId,
    });
  }
}
