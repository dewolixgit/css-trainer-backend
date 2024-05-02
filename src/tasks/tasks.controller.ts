import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { SaveUserInputPayloadDto } from './dto/SaveUserInputPayload.dto';
import { TasksService } from './tasks.service';
import { AuthenticatedRequest } from '../auth/types';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Post('save-input')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async saveUserInput(
    @Req() request: AuthenticatedRequest,
    @Body() body: SaveUserInputPayloadDto,
    // Todo: Typing
  ): Promise<any> {
    const inputValidation = await this._tasksService.validateSaveUserInput({
      payload: body,
    });

    if (inputValidation.isError) {
      throw new BadRequestException(inputValidation.data);
    }

    const savingResult = await this._tasksService.saveUserInput({
      userId: request.user.userId,
      payload: body,
    });

    if (savingResult.isError) {
      throw new HttpException(
        savingResult.data.message,
        savingResult.data.code,
      );
    }

    if ('data' in savingResult) {
      return savingResult.data;
    }

    return 'success';
  }
}
