import { ExerciseDto } from '../dto/exercises/exercises.dto';
import { updateExerciseDto } from '../dto/exercises/update-exercise.dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import {ExercisesService} from '../services/exercises.service'
import { JwtGuard } from 'src/modules/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('exercises')
export class ExercisesController {
    constructor(private ExercisesService: ExercisesService) {}
    //Exercises API
    @Post('create-exercise/:splitId')
    async createExercise(@Param('splitId', ParseIntPipe) splitId : number, @Body() createExercisesDto: ExerciseDto){
        return this.ExercisesService.createExercise(splitId, createExercisesDto);
    }
    @Patch('update-exercise/:id')
    async updateExercise(@Param('id', ParseIntPipe) exerciseId : number, @Body() updateExerciseDto : updateExerciseDto){
        return this.ExercisesService.updateExercise(exerciseId, updateExerciseDto);
    }

    @Delete('delete-exercise/:id')
    async deleteExercise(@Param('id', ParseIntPipe) exerciseId : number){
        return this.ExercisesService.deleteExercise(exerciseId);
    }
}
