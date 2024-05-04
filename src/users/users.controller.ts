import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { AuthenticatedRequest } from '../auth/types';
import { AchievementsStatisticsDto } from './dto/AchievementsStatisticsDto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get('skills')
  @UseGuards(JwtAuthGuard)
  async getAchievementsStatistics(
    @Req() request: AuthenticatedRequest,
  ): Promise<AchievementsStatisticsDto> {
    return this._usersService.getAchievementsStatistics({
      userId: request.user.userId,
    });
  }
}
