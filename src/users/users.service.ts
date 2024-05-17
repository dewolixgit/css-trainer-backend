import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { ToCreateUserDto } from './dto/ToCreateUser.dto';
import { TaskStatus } from '../taskStatus/taskStatus.model';
import { AchievementsService } from '../achievements/achievements.service';
import {
  AchievementsStatisticsDto,
  SkillStatisticsDto,
} from './dto/AchievementsStatisticsDto';
import { ALL_SKILLS, Task, TaskSkill } from '../tasks/tasks.model';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly _achievementsService: AchievementsService,
    private readonly _tasksService: TasksService,
    @InjectModel(TaskStatus)
    private readonly _taskStatusModel: typeof TaskStatus,
    @InjectModel(User) private readonly _userModel: typeof User,
  ) {}

  async findOneById(id: User['id']): Promise<User | null> {
    return this._userModel.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this._userModel.findOne({ where: { email } });
  }

  async create(userToCreate: ToCreateUserDto): Promise<User> {
    return await this._userModel.create({
      email: userToCreate.email,
      password: userToCreate.password,
    });
  }

  async hasAnyCompletedTask(params: { userId: User['id'] }): Promise<boolean> {
    const taskStatus = await this._taskStatusModel.findOne({
      where: {
        userId: params.userId,
        completed: true,
      },
    });

    return !!taskStatus;
  }

  async calculateSkills(params: {
    userId: User['id'];
  }): Promise<Record<TaskSkill, SkillStatisticsDto>> {
    const [allTasksGroupedBySkill, allCompletedTaskStatuses] =
      await Promise.all([
        this._tasksService.getAllGroupedBySkill(),
        this._tasksService.getAllCompletedTaskStatuses({
          userId: params.userId,
        }),
      ]);

    const completedTasks = new Set(
      allCompletedTaskStatuses.map((taskStatus) => taskStatus.taskId),
    );

    // Map skill to completed tasks
    const completedTasksGroupedBySkill = Object.entries(
      allTasksGroupedBySkill,
    ).reduce<Record<TaskSkill, Task[]>>(
      (acc, [skill, tasks]) => ({
        ...acc,
        [skill]: tasks.filter((task) => completedTasks.has(task.id)),
      }),
      {} as Record<TaskSkill, Task[]>,
    );

    // Map skill to percent of completed tasks
    const skillToCompletePercent = (
      Object.entries(completedTasksGroupedBySkill) as [TaskSkill, Task[]][]
    ).reduce<Record<TaskSkill, number>>(
      (acc, [skill, completedTasks]) => {
        const completedCount = completedTasks.length;
        const allTasksOfSkillCount = allTasksGroupedBySkill[skill].length;

        if (!completedCount || !allTasksOfSkillCount) {
          return {
            ...acc,
            [skill]: 0,
          };
        }

        return {
          ...acc,
          [skill]: Math.round((completedCount / allTasksOfSkillCount) * 100),
        };
      },
      {} as Record<TaskSkill, number>,
    );

    return ALL_SKILLS.reduce<Record<TaskSkill, SkillStatisticsDto>>(
      (acc, skill) => ({
        ...acc,
        [skill]: {
          skill,
          percent: skillToCompletePercent[skill] ?? 0,
        },
      }),
      {} as Record<TaskSkill, SkillStatisticsDto>,
    );
  }

  async getCharacterImage(params: { userId: User['id'] }): Promise<string> {
    const [allTasksCount, allCompletedTasksCount] = await Promise.all([
      this._tasksService.getAllCount(),
      this._tasksService.getAllCompletedStatusesCount({
        userId: params.userId,
      }),
    ]);

    const proportion = allCompletedTasksCount / allTasksCount;

    if (proportion < 0.33) {
      return '/api-static/main-character/level-1.png';
    }

    if (proportion < 0.66) {
      return '/api-static/main-character/level-2.png';
    }

    return '/api-static/main-character/level-3.png';
  }

  async getAchievementsStatistics(params: {
    userId: User['id'];
  }): Promise<AchievementsStatisticsDto> {
    const [achievements, skills, characterImage] = await Promise.all([
      this._achievementsService.getAchievementsStatusOrdered({
        userId: params.userId,
      }),
      this.calculateSkills({ userId: params.userId }),
      this.getCharacterImage({
        userId: params.userId,
      }),
    ]);

    return {
      achievements,
      skills,
      characterImage,
    };
  }
}
