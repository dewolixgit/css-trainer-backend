import { Achievement } from './achievements.model';

export enum AchievementRequirement {
  firstCompletedTask = 'firstCompletedTask',
  oneTasksSetCompleted = 'oneTasksSetCompleted',
  twoTasksSetCompleted = 'twoTasksSetCompleted',
  threeTasksSetCompleted = 'threeTasksSetCompleted',
}

/**
 * It's obligatory to have mapped achievements entities in the database
 */
export const ACHIEVEMENT_REQUIREMENT_TO_ID: Record<
  AchievementRequirement,
  Achievement['id']
> = {
  [AchievementRequirement.firstCompletedTask]: 1,
  [AchievementRequirement.oneTasksSetCompleted]: 2,
  [AchievementRequirement.twoTasksSetCompleted]: 3,
  [AchievementRequirement.threeTasksSetCompleted]: 4,
};
