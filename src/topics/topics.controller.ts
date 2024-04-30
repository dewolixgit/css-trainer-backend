import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ToClientTopicDto } from './dto/ToClientTopic.dto';
import { TopicsService } from './topics.service';
import { AuthenticatedRequest } from '../auth/types';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@Controller('topics')
export class TopicsController {
  constructor(private readonly _topicsService: TopicsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Req() request: AuthenticatedRequest,
  ): Promise<ToClientTopicDto[]> {
    return this._topicsService.getAllTopicsAndTasksSetsWithoutTopic({
      userId: request.user.userId,
    });
  }
}
