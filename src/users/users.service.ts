import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { ToCreateUserDto } from './dto/ToCreateUser.dto';
import { TaskStatus } from '../taskStatus/taskStatus.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(TaskStatus)
    private readonly _taskStatusModel: typeof TaskStatus,
    @InjectModel(User) private readonly _userModel: typeof User,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this._userModel.findOne({ where: { email } });
  }

  async create(userToCreate: ToCreateUserDto): Promise<User> {
    return await this._userModel.create({
      email: userToCreate.email,
      password: userToCreate.password,
    });
  }

  async hasAnyCompletedTask(params: { userId: User['id'] }): Promise<boolean> {
    const taskStatus = await this._taskStatusModel.findOne({
      where: {
        userId: params.userId,
        completed: true,
      },
    });

    return !!taskStatus;
  }
}
