import { AchievementDto } from './Achievement.dto';

export class AchievementStatusDto {
  data: AchievementDto;
  order: number;
  completed: boolean;
}
