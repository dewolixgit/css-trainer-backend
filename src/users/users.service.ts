import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { ToCreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly _userModel: typeof User) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this._userModel.findOne({ where: { email } });
  }

  async create(userToCreate: ToCreateUserDto): Promise<User> {
    return await this._userModel.create({
      email: userToCreate.email,
      password: userToCreate.password,
    });
  }
}
