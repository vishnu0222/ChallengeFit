import { Controller, UseGuards } from '@nestjs/common';
import { CreateWorkoutSplitDto } from '../dto/splits/create-workout-split.dto';
import { updateWorkoutSplitDto } from '../dto/splits/update-workout-split.dto';
import { WorkoutSplitsService } from '../services/workout-splits.service';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, Request } from '@nestjs/common';


@UseGuards(JwtGuard)
@Controller('workout-splits')
export class WorkoutSplitsController {

    constructor(private WorkoutSplitsService: WorkoutSplitsService) {}
    
    //Workout Split API

    @Post('create-split/:id')
    async createWorkoutSplit(@Param('id',ParseIntPipe) planId : number, @Body() createWorkoutSplitDto: CreateWorkoutSplitDto){
        return this.WorkoutSplitsService.createWorkoutSplit(planId, createWorkoutSplitDto)
    }

    @Get('get-all-splits/:id')
    async getAllWorkoutSplits(@Param('id', ParseIntPipe) planId:number){
        return this.WorkoutSplitsService.getAllWorkoutSplits(planId);
    }

    @Get('get-split/:planId/:splitId')
    async getWorkoutSplitById(@Param('planId', ParseIntPipe) planId : number, @Param('splitId', ParseIntPipe) splitId : number) {
        return this.WorkoutSplitsService.getWorkoutSplitById(planId, splitId);
    }

    @Patch('update/plan/:planId/split/:splitId')
    async updateWorkoutSplit(@Param('planId', ParseIntPipe) planId : number,@Param('splitId', ParseIntPipe) splitId : number, @Body() updateWorkoutSplitDto: updateWorkoutSplitDto ) {
        return this.WorkoutSplitsService.updateWorkoutSplit(planId, splitId,updateWorkoutSplitDto)
    }

    @Delete('delete/plan/:planId/split/:splitId')
    async deleteWorkoutSplit(@Param('planId', ParseIntPipe) planId : number,@Param('splitId', ParseIntPipe) splitId : number){
        return this.WorkoutSplitsService.deleteWorkoutSplit(planId, splitId);
    }
    @Post('add-split/:planId')
    async addSplitToPlan(@Param('planId',ParseIntPipe) planId : number, @Body() splitDto : CreateWorkoutSplitDto){
        return this.WorkoutSplitsService.addSplitToPlan(planId, splitDto);
    }
}
