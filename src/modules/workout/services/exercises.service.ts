import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExerciseDto } from '../dto/exercises/exercises.dto';
import { updateExerciseDto } from '../dto/exercises/update-exercise.dto';

@Injectable()
export class ExercisesService {
    constructor(private prismaService: PrismaService){}

    async createExercise(splitId : number, createExercisesDto : ExerciseDto){
        try {
            const splitExists = await this.prismaService.workoutSplit.findFirst({
                where : {
                    id : splitId,
                }
            })
            if(!splitExists) {
                throw new BadRequestException('split does not exists');
            }
            const newExercise = await this.prismaService.exercises.create({
                data :{
                    exerciseName : createExercisesDto.exerciseName,
                    split : {connect : {id : splitId}},
                    sets : createExercisesDto.sets
                }
            })
            return { message : 'New Exercise has been created', newExercise : newExercise};
        } catch (error) {
            throw new Error('Error while creating a new Exercise');
        }
    }
    async updateExercise(exerciseId : number, updateExerciseDto : updateExerciseDto){
        const exerciseExists = await this.prismaService.exercises.findFirst({
            where: {
                id : exerciseId,
            }
        })
        if(!exerciseExists) { 
            throw new BadRequestException('Exercise does not exists, try something else');
        }
        const updatedExercise = await this.prismaService.exercises.update({
            where : {
                id : exerciseId,
            },
            data : {
                ...(updateExerciseDto),
            }
        })
        return { message : 'Exercise has been updated', updatedExercise : updatedExercise};
    }
    async deleteExercise(exerciseId : number) {
        const exerciseExists = await this.prismaService.exercises.findFirst({
            where : {
                id : exerciseId,
            }
        })
        if(!exerciseExists) {
            throw new BadRequestException('Exercise does not exists');
        }
        const exerciseName = exerciseExists.exerciseName;
        await this.prismaService.exercises.delete({
            where : {
                id : exerciseId,
            }
        })
        return {message : `Exercise '${exerciseName}' has been deleted successfully`};
    }
}
