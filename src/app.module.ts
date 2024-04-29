import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievement } from './achievements';
import { User, UsersModule } from './users';
import { UserAchievement } from './userAchievements';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, AuthService } from './auth';
import { JwtService } from '@nestjs/jwt';
import { InfoFlowTextBlock } from './infoFlowTextBlock';
import { InfoFlowImageBlock } from './infoFlowImageBlock';
import { InfoFlowCodeBlock } from './infoFlowCodeBlock';
import { InputFlowDnd } from './inputFlowDnd';
import { InputFlowDndOption } from './inputFlowDndOption';
import { InputFlowDndInput } from './inputFlowDndInput';
import { InputFlowDndOptionInput } from './inputFlowDndOptionInput';
import { InputFlowOnlyCode } from './inputFlowOnlyCode';
import { InputFlowOnlyCodeInput } from './inputFlowOnlyCodeInput';
import { InputFlowPartCode } from './inputFlowPartCode';
import { PartCodeMixedRowCodeElement } from './partCodeMixedRowCodeElement';
import { PartCodeMixedRow } from './partCodeMixedRow';
import { PartCodeOnlyRow } from './partCodeOnlyRow';
import { PartCodeOnlyRowInput } from './partCodeOnlyRowInput';
import { PartCodeMixedRowTextElement } from './partCodeMixedRowTextElement';
import { PartCodeMixedRowCodeElementInput } from './partCodeMixedRowCodeElementInput';
import { Topic } from './topic';
import { TasksSet } from './tasksSets';
import { Task } from './tasks';
import { TaskStatus } from './taskStatus';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      models: [
        // User
        User,

        // Achievement
        Achievement,
        UserAchievement,

        // Topic
        Topic,

        // Tasks Set
        TasksSet,

        // Task
        Task,
        TaskStatus,

        // Info content flow blocks
        InfoFlowTextBlock,
        InfoFlowImageBlock,
        InfoFlowCodeBlock,

        // Input content flow block, drag and drop
        InputFlowDnd,
        InputFlowDndOption,
        InputFlowDndInput,
        InputFlowDndOptionInput,

        // Input content flow block, only code
        InputFlowOnlyCode,
        InputFlowOnlyCodeInput,

        // Input content flow block, part code
        InputFlowPartCode,
        PartCodeOnlyRow,
        PartCodeOnlyRowInput,
        PartCodeMixedRow,
        PartCodeMixedRowTextElement,
        PartCodeMixedRowCodeElement,
        PartCodeMixedRowCodeElementInput,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Achievement]),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
