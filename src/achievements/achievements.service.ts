import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Achievement } from './achievements.model';
import { UserAchievement } from '../userAchievements/userAchievements.model';
import { User } from '../users/users.model';
import { TasksSetsService } from '../tasksSets/tasksSets.service';
import {
  ACHIEVEMENT_REQUIREMENT_TO_ID,
  AchievementRequirement,
} from './config';
import { UsersService } from '../users/users.service';
import { AchievementStatusDto } from './dto/AchievementStatus.dto';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly _usersService: UsersService,
    @Inject(forwardRef(() => TasksSetsService))
    private readonly _tasksSetService: TasksSetsService,
    @InjectModel(Achievement)
    private readonly _achievementModel: typeof Achievement,
    @InjectModel(UserAchievement)
    private readonly _userAchievementModel: typeof UserAchievement,
  ) {}

  async checkAchievements(params: {
    userId: User['id'];
  }): Promise<Achievement[]> {
    const achievementIdsToSave = [];

    const allTasksSets = await this._tasksSetService.getAllWithProgress({
      userId: params.userId,
    });

    const userAchievements = await this._userAchievementModel.findAll({
      where: {
        userId: params.userId,
      },
    });

    const completedTasksSets = allTasksSets.filter(
      (tasksSet) => tasksSet.completed,
    );

    if (
      completedTasksSets.length >= 1 &&
      !userAchievements.find(
        (achievement) =>
          achievement.achievementId ===
          ACHIEVEMENT_REQUIREMENT_TO_ID[
            AchievementRequirement.oneTasksSetCompleted
          ],
      )
    ) {
      achievementIdsToSave.push(
        ACHIEVEMENT_REQUIREMENT_TO_ID[
          AchievementRequirement.oneTasksSetCompleted
        ],
      );
    }

    if (
      completedTasksSets.length >= 2 &&
      !userAchievements.find(
        (achievement) =>
          achievement.achievementId ===
          ACHIEVEMENT_REQUIREMENT_TO_ID[
            AchievementRequirement.twoTasksSetCompleted
          ],
      )
    ) {
      achievementIdsToSave.push(
        ACHIEVEMENT_REQUIREMENT_TO_ID[
          AchievementRequirement.twoTasksSetCompleted
        ],
      );
    }

    if (
      completedTasksSets.length >= 3 &&
      !userAchievements.find(
        (achievement) =>
          achievement.achievementId ===
          ACHIEVEMENT_REQUIREMENT_TO_ID[
            AchievementRequirement.threeTasksSetCompleted
          ],
      )
    ) {
      achievementIdsToSave.push(
        ACHIEVEMENT_REQUIREMENT_TO_ID[
          AchievementRequirement.threeTasksSetCompleted
        ],
      );
    }

    if (
      !userAchievements.find(
        (achievement) =>
          achievement.achievementId ===
          ACHIEVEMENT_REQUIREMENT_TO_ID[
            AchievementRequirement.firstCompletedTask
          ],
      )
    ) {
      if (completedTasksSets.length) {
        achievementIdsToSave.push(
          ACHIEVEMENT_REQUIREMENT_TO_ID[
            AchievementRequirement.firstCompletedTask
          ],
        );
      } else {
        const hasCompletedTask = await this._usersService.hasAnyCompletedTask({
          userId: params.userId,
        });

        if (hasCompletedTask) {
          achievementIdsToSave.push(
            ACHIEVEMENT_REQUIREMENT_TO_ID[
              AchievementRequirement.firstCompletedTask
            ],
          );
        }
      }
    }

    if (!achievementIdsToSave.length) {
      return [];
    }

    // Will throw an error if there is no such achievements
    await this._userAchievementModel.bulkCreate(
      achievementIdsToSave.map((achievementToSave) => ({
        achievementId: achievementToSave,
        userId: params.userId,
      })),
    );

    return await this._achievementModel.findAll({
      where: {
        id: achievementIdsToSave,
      },
    });
  }

  async checkAchievementsDto(params: {
    userId: User['id'];
  }): Promise<AchievementStatusDto[]> {
    return (await this.checkAchievements({ userId: params.userId })).map(
      (achievement) => ({
        data: {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
        },
        completed: true,
      }),
    );
  }
}
