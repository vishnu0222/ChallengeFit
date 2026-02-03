import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutPlanDto } from '../dto/plans/create-workoutplan.dto';
import { updateWorkoutPlanDto } from '../dto/plans/update-workout-plan.dto';

@Injectable()
export class WorkoutPlanService {
    constructor(private prismaService: PrismaService){}

    // Workout Plan API

    async createWorkoutPlan(userId : number, createWorkoutPlanDto : CreateWorkoutPlanDto) {
        try {
            let newWorkoutPlan : CreateWorkoutPlanDto;
            const planExists = await this.prismaService.workoutPlan.findFirst({
                where :{
                    title : createWorkoutPlanDto.title
                }
            })
            if(planExists) {
                return {message : "Plan name already exists, please try something new"};
            }
            if(!createWorkoutPlanDto.workoutSplits){
                newWorkoutPlan = await this.prismaService.workoutPlan.create({
                    data : {
                        title : createWorkoutPlanDto.title,
                        user : {connect:{id:userId}},
                    }
                })
            }
            else{
                newWorkoutPlan = await this.prismaService.workoutPlan.create({
                    data : {
                        title: createWorkoutPlanDto.title,
                        user: {connect:{id:userId}},
                        workoutSplits:{
                            create: createWorkoutPlanDto.workoutSplits.map(split=>({
                                workoutSplitName: split.workoutSplitName,
                                exercises:{
                                    create: split.exercises?.map(exercise=>({
                                        exerciseName: exercise.exerciseName,
                                        sets: exercise.sets,
                                    }))
                                }
                            }))
                        }
                    },
                    include: {
                        workoutSplits:{
                            include: {
                                exercises: true,
                            }
                        }
                    }
                })
            }
            
            return { message: 'Workout plan created successfully', workoutPlan: newWorkoutPlan };
        } catch (error) {
            throw new Error('Error creating workout plan');
        }
    }

    async getAllWorkoutPlans(userId: number){
        try {
            const getAllWorkoutPlans = await this.prismaService.workoutPlan.findMany({
                where:{
                    userId: userId
                },
                select: {
                    title: true,
                    workoutSplits:{
                        select:{
                            workoutSplitName: true,
                            exercises:{
                                select: {
                                    exerciseName: true,
                                    sets: true,
                                    createdAt: true,
                                }
                            }
                        }
                    },
                }
            })
            return { message: 'Workout plans retrieved successfully', workoutPlans: getAllWorkoutPlans };
        } catch (error) {
            throw new Error('Error retrieving workout plans');
        }
    }

    async getWorkoutPlanById(workoutPlanId: number) {
        try {
            const WorkoutplanById = await this.prismaService.workoutPlan.findUnique({
                where:{
                    id: workoutPlanId
                },
                select: {
                    title: true,
                    workoutSplits:{
                        select:{
                            workoutSplitName: true,
                            exercises:{
                                select: {
                                    exerciseName: true,
                                    sets: true,
                                    createdAt: true,
                                }
                            }
                        }
                    },
                }
            })
            return { message: 'Workout plan retrieved successfully', workoutPlan: WorkoutplanById };
        } catch (error) {
            throw new Error('Error retrieving workout plan by ID');
            
        }
    }

    async updateWorkoutPlan(planId: number, updateWorkoutPlanDto:updateWorkoutPlanDto){
        try {
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where: {
                    id: planId,
                },
            })
            if (!workoutPlan) {
                throw new BadRequestException('Workout plan not found');
            }
            const updateWorkoutPlan = await this.prismaService.workoutPlan.update({
                where:{
                    id: planId,
                },
                data:{
                    ...updateWorkoutPlanDto, 
                    updatedAt: new Date(),
                }
            })
            return {message : 'Workoutplan updated successfully', workoutPlan: updateWorkoutPlan}
        } catch (error) {
            throw new Error('Error updating workout plan');
        }
    }

    async deleteWorkoutPlan(planId: number){
        try {
            const workoutPlan = await this.prismaService.workoutPlan.findUnique({
                where: {
                    id: planId,
                },
            })
            if (!workoutPlan) {
                throw new BadRequestException('Workout plan not found');
            }
            const workoutPlanTitle = workoutPlan.title;
            const deleteWorkouPlan = await this.prismaService.workoutPlan.delete({
                where:{
                    id: planId
                }
            })
            return { message: `Workout plan '${workoutPlanTitle}' deleted successfully`};
        } catch (error) {
            if(error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting workout plan');
        }
    }


    

    
}
