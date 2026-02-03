import { Module } from '@nestjs/common';
import { WorkoutController } from './controllers/workout-plans.controller';
import { WorkoutPlanService } from './services/workout-plans.service';
import { WorkoutSplitsController } from './controllers/workout-splits.controller';
import { ExercisesController } from './controllers/exercises.controller';
import { ExercisesService } from './services/exercises.service';
import { WorkoutSplitsService } from './services/workout-splits.service';

@Module({
  controllers: [WorkoutController, WorkoutSplitsController, ExercisesController],
  providers: [WorkoutPlanService, WorkoutSplitsService, ExercisesService]
})
export class WorkoutModule {}
