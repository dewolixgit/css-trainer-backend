import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { TaskStatus } from '../taskStatus/taskStatus.model';

@Module({
  imports: [SequelizeModule.forFeature([User, TaskStatus])],
  providers: [UsersService],
  exports: [SequelizeModule, UsersService],
})
export class UsersModule {}
