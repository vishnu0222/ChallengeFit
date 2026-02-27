import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { WorkoutModule } from './modules/workout/workout.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [AuthModule, UserModule, ChallengeModule, PrismaModule, ConfigModule.forRoot({isGlobal : true}),
    MulterModule.register({dest: './uploads', limits : {fileSize : 1024 * 1024 * 5}}),
    WorkoutModule, ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
