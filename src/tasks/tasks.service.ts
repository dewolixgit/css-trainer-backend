import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InfoFlowImageBlock } from '../infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowTextBlock } from '../infoFlowTextBlock/infoFlowTextBlock.model';
import { InfoFlowCodeBlock } from '../infoFlowCodeBlock/infoFlowCodeBlock.model';
import { Task } from './tasks.model';
import { InfoFlowBlocksDtoUnion, TaskSectionEnum } from './types';
import { InputFlowOnlyCodeDto } from './dto/InputFlowOnlyCode.dto';
import { InputFlowOnlyCode } from '../inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from '../inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { User } from '../users/users.model';
import { PartCodeMixedRow } from '../partCodeMixedRow/partCodeMixedRow.model';
import {
  PartCodeMixedRowCodeElementDto,
  PartCodeMixedRowTextElementDto,
} from './dto/InputFlowPartCode.dto';
import { PartCodeMixedRowCodeElement } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.model';
import { PartCodeMixedRowCodeElementInput } from '../partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { PartCodeMixedRowTextElement } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.model';
import { PartCodeMixedRowTextElementService } from '../partCodeMixedRowTextElement/partCodeMixedRowTextElement.service';
import { PartCodeMixedRowCodeElementService } from '../partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.service';
import { InputFlowOnlyCodeService } from '../inputFlowOnlyCode/inputFlowOnlyCode.service';
import { InfoFlowTextBlockService } from '../infoFlowTextBlock/infoFlowTextBlock.service';
import { InfoFlowImageBlockService } from '../infoFlowImageBlock/infoFlowImageBlock.service';
import { InfoFlowCodeBlockService } from '../infoFlowCodeBlock/infoFlowCodeBlock.service';

@Injectable()
export class TasksService {
  // Todo: Consider to remove unused
  constructor(
    private readonly _infoFlowTextBlockService: InfoFlowTextBlockService,
    private readonly _infoFlowImageBlockService: InfoFlowImageBlockService,
    private readonly _infoFlowCodeBlockService: InfoFlowCodeBlockService,
    private readonly _inputFlowOnlyCodeService: InputFlowOnlyCodeService,
    private readonly _partCodeMixedRowTextElementService: PartCodeMixedRowTextElementService,
    private readonly _partCodeMixedRowCodeElementService: PartCodeMixedRowCodeElementService,
    @InjectModel(InfoFlowImageBlock)
    private readonly _infoFlowImageBlockModel: typeof InfoFlowImageBlock,
    @InjectModel(InfoFlowTextBlock)
    private readonly _infoFlowTextBlockModel: typeof InfoFlowTextBlock,
    @InjectModel(InfoFlowCodeBlock)
    private readonly _infoFlowCodeBlockModel: typeof InfoFlowCodeBlock,
    @InjectModel(InputFlowOnlyCode)
    private readonly _inputFlowOnlyCodeModel: typeof InputFlowOnlyCode,
    @InjectModel(InputFlowOnlyCodeInput)
    private readonly _inputFlowOnlyCodeInputModel: typeof InputFlowOnlyCodeInput,
    @InjectModel(PartCodeMixedRowTextElement)
    private readonly _partCodeMixedRowTextElementModel: typeof PartCodeMixedRowTextElement,
    @InjectModel(PartCodeMixedRowCodeElement)
    private readonly _partCodeMixedRowCodeElementModel: typeof PartCodeMixedRowCodeElement,
    @InjectModel(PartCodeMixedRowCodeElementInput)
    private readonly _partCodeMixedRowCodeElementInputModel: typeof PartCodeMixedRowCodeElementInput,
  ) {}

  async getAllInfoFlowBlocks(params: {
    taskId: Task['id'];
    section: TaskSectionEnum;
  }): Promise<InfoFlowBlocksDtoUnion[]> {
    return [
      ...(await this._infoFlowTextBlockService.getAllInfoFlowTextBlocks({
        taskId: params.taskId,
        section: params.section,
      })),
      ...(await this._infoFlowImageBlockService.getAllInfoFlowImageBlocks({
        taskId: params.taskId,
        section: params.section,
      })),
      ...(await this._infoFlowCodeBlockService.getAllInfoFlowCodeBlocks({
        taskId: params.taskId,
        section: params.section,
      })),
    ];
  }

  async getAllInputFlowOnlyCodeBlocksWithUserInput(params: {
    taskId: Task['id'];
    userId: User['id'];
  }): Promise<InputFlowOnlyCodeDto[]> {
    return this._inputFlowOnlyCodeService.getAllInputFlowOnlyCodeBlocksWithUserInput(
      { taskId: params.taskId, userId: params.userId },
    );
  }

  async getAllPartCodeMixedRowCodeElementsWithUserInput(params: {
    rowId: PartCodeMixedRow['id'];
    userId: User['id'];
  }): Promise<PartCodeMixedRowCodeElementDto[]> {
    return this._partCodeMixedRowCodeElementService.getAllPartCodeMixedRowCodeElementsWithUserInput(
      { rowId: params.rowId, userId: params.userId },
    );
  }

  async getAllPartCodeMixedTextElement(params: {
    rowId: number;
  }): Promise<PartCodeMixedRowTextElementDto[]> {
    return this._partCodeMixedRowTextElementService.getAllPartCodeMixedTextElement(
      { rowId: params.rowId },
    );
  }

  // async getAllInputFlowDndBlocks(params: {
  //   taskId: Task['id'];
  // }): Promise<InputFlowDndDto[]> {}
}
