import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievement } from './achievements/achievements.model';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { UserAchievement } from './userAchievements/userAchievements.model';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { InfoFlowTextBlock } from './infoFlowTextBlock/infoFlowTextBlock.model';
import { InfoFlowImageBlock } from './infoFlowImageBlock/infoFlowImageBlock.model';
import { InfoFlowCodeBlock } from './infoFlowCodeBlock/infoFlowCodeBlock.model';
import { InputFlowDnd } from './inputFlowDnd/inputFlowDnd.model';
import { InputFlowDndOption } from './inputFlowDndOption/inputFlowDndOption.model';
import { InputFlowDndInput } from './inputFlowDndInput/inputFlowDndInput.model';
import { InputFlowDndOptionInput } from './inputFlowDndOptionInput/inputFlowDndOptionInput.model';
import { InputFlowOnlyCode } from './inputFlowOnlyCode/inputFlowOnlyCode.model';
import { InputFlowOnlyCodeInput } from './inputFlowOnlyCodeInput/inputFlowOnlyCodeInput.model';
import { InputFlowPartCode } from './inputFlowPartCode/inputFlowPartCode.model';
import { PartCodeMixedRowCodeElement } from './partCodeMixedRowCodeElement/partCodeMixedRowCodeElement.model';
import { PartCodeMixedRow } from './partCodeMixedRow/partCodeMixedRow.model';
import { PartCodeOnlyRow } from './partCodeOnlyRow/partCodeOnlyRow.model';
import { PartCodeOnlyRowInput } from './partCodeOnlyRowInput/partCodeOnlyRowInput.model';
import { PartCodeMixedRowTextElement } from './partCodeMixedRowTextElement/partCodeMixedRowTextElement.model';
import { PartCodeMixedRowCodeElementInput } from './partCodeMixedRowCodeElementInput/partCodeMixedRowCodeElementInput.model';
import { TopicsModule } from './topics/topics.module';
import { Topic } from './topics/topics.model';
import { TasksSet } from './tasksSets/tasksSets.model';
import { Task } from './tasks/tasks.model';
import { TaskStatus } from './taskStatus/taskStatus.model';
import { TasksSetsModule } from './tasksSets/tasksSets.module';

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
    TopicsModule,
    TasksSetsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
