import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWorkoutSplitDto } from '../dto/splits/create-workout-split.dto';
import { updateWorkoutSplitDto } from '../dto/splits/update-workout-split.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkoutSplitsService {
    constructor(private prismaService: PrismaService){}

    // Workout Split API
    async createWorkoutSplit(planId : number, createWorkoutSplitDto : CreateWorkoutSplitDto) {
        try {
            let newWorkoutSplit : CreateWorkoutSplitDto;
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where : {
                    id: planId,
                }
            })
            if(!workoutPlan) {
                throw new BadRequestException('Workout plan not found');
            }
            if(!createWorkoutSplitDto.exercises){
                newWorkoutSplit = await this.prismaService.workoutSplit.create({
                    data : {
                        workoutSplitName : createWorkoutSplitDto.workoutSplitName,
                        plan : {connect : {id : planId}},
                    }
                })
            }
            else {
                newWorkoutSplit = await this.prismaService.workoutSplit.create({
                    data: {
                        workoutSplitName: createWorkoutSplitDto.workoutSplitName,
                        plan : {connect : {id : planId}},
                        exercises:{
                            create: createWorkoutSplitDto.exercises?.map(exercise =>({
                                exerciseName : exercise.exerciseName,
                                sets : exercise.sets
                            }))
                        }
                    },
                    
                    include: {
                        plan: true,
                        exercises: true,
                    }
                })
            }
            const workoutSplitName = newWorkoutSplit.workoutSplitName;
            return { message: `Workout split '${workoutSplitName}' created successfully`, workoutSplit: newWorkoutSplit };
        } catch (error) {
            throw new Error('Error creating workout split');
        }
    }

    async getAllWorkoutSplits(planId: number) {
        try {
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where: {
                    id:planId
                }
            })
            if(!workoutPlan){
                throw new BadRequestException('Workout plan not found');
            }
            const allWorkoutSplits = await this.prismaService.workoutSplit.findMany({
                where:{
                    planId: planId,
                },
                select:{
                    workoutSplitName:true,
                    exercises:{
                        select:{
                            exerciseName: true,
                            sets: true,
                            createdAt: true,
                        }
                    }
                }
            })
            const workoutPlanTitle = workoutPlan.title;
            return { message: `All workout splits for plan '${workoutPlanTitle}' retrieved successfully`, workoutSplits: allWorkoutSplits };
        } catch (error) {
            
        }
    }
    async getWorkoutSplitById(planId: number, splitId: number) {
        try {
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where: {
                    id : planId
                }
            })
            if(!workoutPlan) {
                throw new BadRequestException('Workout plan not found');
            }
            const workoutSplit = await this.prismaService.workoutSplit.findUnique({
                where: {
                    id: splitId,
                }
            })
            if(!workoutSplit){
                throw new BadRequestException('Workout split not found');
            }
            return { message: 'Workout split retrieved successfully', workoutSplit: workoutSplit };
        } catch (error) {
            
        }
    }

    async updateWorkoutSplit(planId: number, splitId : number, updateWorkoutSplitDto: updateWorkoutSplitDto) {
        try {
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where: {
                    id : planId
                }
            })
            if(!workoutPlan) {
                throw new BadRequestException('Workout plan not found');
            }
            const workoutSplit = await this.prismaService.workoutSplit.findUnique({
                where: {
                    id: splitId,
                }
            })
            if(!workoutSplit){
                throw new BadRequestException('Workout split not found');
            }
            const updateWorkoutSplit = await this.prismaService.workoutSplit.update({
                where: {
                    id: splitId,
                },
                data:{
                    ...updateWorkoutSplitDto,
                    updatedAt: new Date(),
                }
            })
            const updatedWorkoutSplitName = updateWorkoutSplit.workoutSplitName;
            return {message : `Workout Split '${updatedWorkoutSplitName}' updated successfully`, workoutSplit: updateWorkoutSplit};
        } catch (error) {
            throw new Error('Error updating workout split');
        }
    }
    async deleteWorkoutSplit(planId: number, splitId : number){
        try {
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where: {
                    id : planId
                }
            })
            if(!workoutPlan) {
                throw new BadRequestException('Workout plan not found');
            }
            const workoutSplit = await this.prismaService.workoutSplit.findUnique({
                where: {
                    id: splitId,
                }
            })
            if(!workoutSplit){
                throw new BadRequestException('Workout split not found');
            }
            const workoutSplitName = workoutSplit.workoutSplitName;
            const deleteWorkoutSplit = await this.prismaService.workoutSplit.delete({
                where: {
                    id: splitId,
                }
            })
            return { message: `Workout split '${workoutSplitName}' deleted successfully` };
        } catch (error) {
            
        }
    }
    async addSplitToPlan(planId : number, splitDto : CreateWorkoutSplitDto){
        try {
            const planExists = await this.prismaService.workoutPlan.findUnique({
                where : {
                    id : planId
                }
            })
            if(!planExists) { 
                throw new BadRequestException('Workout plan does not exists');
            }
            const splitExists = await this.prismaService.workoutSplit.findFirst({
                where:{
                    planId: planId,
                    workoutSplitName: splitDto.workoutSplitName,
                }
            })
            if(splitExists){
                throw new BadRequestException("Split already exists");
            }
            const newWorkoutSplit = await this.prismaService.workoutSplit.create({
                data: {
                    workoutSplitName: splitDto.workoutSplitName,
                    plan : {connect : {id : planId}},
                    ...(splitDto.exercises?.length? {
                        exercises : {
                            create : splitDto.exercises.map((exercise) => ({
                                exerciseName : exercise.exerciseName,
                                sets : exercise.sets,
                            }))
                        },
                    }: {}),
                },
                select : {
                    id: true,
                    workoutSplitName : true,
                    plan: { select: { id: true, title: true } },
                    exercises: { select: { id: true, exerciseName: true, sets: true } },
                }
            })
            return{ message : 'New workout split added successfully', newWorkoutSplit};
        } catch (error) {
            throw new Error('Error while adding a new workout split');
        }
    }
}
