import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { WorkoutPlanService } from '../workout/services/workout-plans.service';
import { ChallengeService } from '../challenge/challenge.service';
import { WorkoutSplitsService } from '../workout/services/workout-splits.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    WorkoutPlanService,
    WorkoutSplitsService,
    ChallengeService,
    UserService,
  ],
})
export class ChatModule {}
