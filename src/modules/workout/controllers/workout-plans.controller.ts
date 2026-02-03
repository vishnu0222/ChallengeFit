import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { WorkoutPlanService } from '../services/workout-plans.service';
import { CreateWorkoutPlanDto } from '../dto/plans/create-workoutplan.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { updateWorkoutPlanDto } from '../dto/plans/update-workout-plan.dto';


@UseGuards(JwtGuard)
@Controller('workout')
export class WorkoutController {
    constructor(private WorkoutPlanService: WorkoutPlanService) {}
    // Workout Plan API

    @Post('create-workout-plan')
    async createWorkoutPlan(@Request() req : any, @Body() createWorkoutPlanDto : CreateWorkoutPlanDto) {
        return this.WorkoutPlanService.createWorkoutPlan(req.user.id, createWorkoutPlanDto);
    }

    @Get('get-all-plans')
    async getAllWorkoutPlans(@Request() req:any) {
        return this.WorkoutPlanService.getAllWorkoutPlans(req.user.id);
    }

    @Get('get-plan/:id')
    async getWorkoutPlanById(@Param('id') planId: number) {
        return this.WorkoutPlanService.getWorkoutPlanById(planId);
    }

    @Patch('update-plan/:id')
    async updateWorkoutPlan(@Param('id',ParseIntPipe) planId : number, @Body() updateWorkoutPlanDto : updateWorkoutPlanDto){
        return this.WorkoutPlanService.updateWorkoutPlan(planId, updateWorkoutPlanDto);
    }

    @Delete('delete-plan/:id')
    async deleteWorkoutPlan(@Param('id', ParseIntPipe) planId : number) {
        return this.WorkoutPlanService.deleteWorkoutPlan(planId);
    }

    

    
}
