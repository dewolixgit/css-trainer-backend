import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievement } from './achievements/achievement.model';
import { User } from './users/user.model';
import { UserAchievement } from './userAchievements/userAchievement.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: `${process.env.DATABASE_HOST}`,
      port: Number(process.env.DATABASE_PORT),
      username: `${process.env.DATABASE_USER}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      models: [Achievement, User, UserAchievement],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Achievement]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
