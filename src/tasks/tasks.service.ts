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
  InputFlowPartCodeDto,
  PartCodeMixedRowCodeElementDto,
  PartCodeMixedRowDto,
  PartCodeMixedRowTextElementDto,
  PartCodeOnlyRowDto,
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
import { PartCodeMixedRowService } from '../partCodeMixedRow/partCodeMixedRow.service';
import { InputFlowPartCode } from '../inputFlowPartCode/inputFlowPartCode.model';
import { PartCodeOnlyRowService } from '../partCodeOnlyRow/partCodeOnlyRow.service';
import { InputFlowPartCodeService } from '../inputFlowPartCode/inputFlowPartCode.service';
import { InputFlowDndOptionService } from '../inputFlowDndOption/inputFlowDndOption.service';
import { InputFlowDndDto, InputFlowDndOptionDto } from './dto/InputFlowDnd.dto';
import { InputFlowDndInput } from '../inputFlowDndInput/inputFlowDndInput.model';
import { InputFlowDnd } from '../inputFlowDnd/inputFlowDnd.model';
import { InputFlowDndService } from '../inputFlowDnd/inputFlowDnd.service';

@Injectable()
export class TasksService {
  // Todo: Consider to remove unused
  constructor(
    private readonly _infoFlowTextBlockService: InfoFlowTextBlockService,
    private readonly _infoFlowImageBlockService: InfoFlowImageBlockService,
    private readonly _infoFlowCodeBlockService: InfoFlowCodeBlockService,
    private readonly _inputFlowOnlyCodeService: InputFlowOnlyCodeService,
    private readonly _inputFlowPartCodeService: InputFlowPartCodeService,
    private readonly _partCodeOnlyRowService: PartCodeOnlyRowService,
    private readonly _partCodeMixedRowService: PartCodeMixedRowService,
    private readonly _partCodeMixedRowTextElementService: PartCodeMixedRowTextElementService,
    private readonly _partCodeMixedRowCodeElementService: PartCodeMixedRowCodeElementService,
    private readonly _inputFlowDndService: InputFlowDndService,
    private readonly _inputFlowDndOptionService: InputFlowDndOptionService,
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

  async getAllInputFlowPartCodeBlocksWithUserInput(params: {
    taskId: Task['id'];
    userId: User['id'];
  }): Promise<InputFlowPartCodeDto[]> {
    return this._inputFlowPartCodeService.getAllInputFlowPartCodeWithUserInput({
      userId: params.userId,
      taskId: params.taskId,
    });
  }

  async getAllPartCodeOnlyRowsWithUserInput(params: {
    userId: User['id'];
    inputFlowPartCodeId: InputFlowPartCode['id'];
  }): Promise<PartCodeOnlyRowDto[]> {
    return this._partCodeOnlyRowService.getAllPartCodeOnlyRowsWithUserInput({
      userId: params.userId,
      inputFlowPartCodeId: params.inputFlowPartCodeId,
    });
  }

  async getAllPartCodeMixedRowsWithUserInput(params: {
    userId: User['id'];
    inputFlowPartCodeId: InputFlowPartCode['id'];
  }): Promise<PartCodeMixedRowDto[]> {
    return this._partCodeMixedRowService.getAllPartCodeMixedRowsWithUserInput({
      userId: params.userId,
      inputFlowPartCodeId: params.inputFlowPartCodeId,
    });
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

  async getAllInputFlowDndOptionsWithUserInput(params: {
    inputFlowDndId: InputFlowDnd['id'];
    inputFlowDndInputId: InputFlowDndInput['id'];
    userId: User['id'];
  }): Promise<InputFlowDndOptionDto[]> {
    return this._inputFlowDndOptionService.getAllInputFlowDndOptionsWithUserInput(
      {
        inputFlowDndId: params.inputFlowDndId,
        inputFlowDndInputId: params.inputFlowDndInputId,
        userId: params.userId,
      },
    );
  }

  async getAllInputFlowDndWithUserInput(params: {
    taskId: Task['id'];
    userId: User['id'];
  }): Promise<InputFlowDndDto[]> {
    return this._inputFlowDndService.getAllInputFlowDndWithUserInput({
      taskId: params.taskId,
      userId: params.userId,
    });
  }

  // async getAllInputFlowDndBlocks(params: {
  //   taskId: Task['id'];
  // }): Promise<InputFlowDndDto[]> {}
}
