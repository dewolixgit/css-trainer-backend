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
  // Todo: Use body
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async saveUserInput(
    @Req() request: AuthenticatedRequest,
    @Body() body: SaveUserInputPayloadDto,
  ): Promise<any> {
    const inputValidation = await this._tasksService.validateSaveUserInput({
      payload: body,
    });

    if (inputValidation.isError) {
      throw new BadRequestException(inputValidation.data);
    }

    // Todo: Validate dnd options

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
