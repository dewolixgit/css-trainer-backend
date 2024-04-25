import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Achievement } from './achievements/achievement.model';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Achievement) private achievementModel: typeof Achievement,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
