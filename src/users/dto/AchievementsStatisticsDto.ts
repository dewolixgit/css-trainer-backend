import { TaskSkill } from '../../tasks/tasks.model';
import { AchievementStatusDto } from '../../achievements/dto/AchievementStatus.dto';

export class SkillStatisticsDto {
  skill: TaskSkill;
  percent: number;
}

export class AchievementsStatisticsDto {
  skills: Record<TaskSkill, SkillStatisticsDto>;
  achievements: AchievementStatusDto[];
  characterImage: string;
}
