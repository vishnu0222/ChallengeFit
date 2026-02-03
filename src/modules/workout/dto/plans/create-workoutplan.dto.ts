import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateWorkoutSplitDto } from "../splits/create-workout-split.dto";

export class CreateWorkoutPlanDto {

    @IsNotEmpty()
    @IsString({message: 'Title must be a '})
    title: string
    
    @IsOptional()
    @IsArray()
    workoutSplits?: CreateWorkoutSplitDto[];
}