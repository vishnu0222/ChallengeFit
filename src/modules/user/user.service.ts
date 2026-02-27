import { BadRequestException, Injectable } from '@nestjs/common';
import { editProfileDto } from './dto/editProfile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService : PrismaService){}
    async getProfile(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true, lastName: true },
        });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return { message: 'Profile retrieved successfully', profile: user };
    }
    async editProfile(id : number, editProfileDto : editProfileDto) {
        const user = await this.prismaService.user.findUnique({
            where : {
                id : id
            }
        })
        if(!user) {
            throw new Error('User not found');
        }
        const updatedUser = await this.prismaService.user.update({
            where : {id : id},
            data : { ...editProfileDto}
        })
        return {message : "User updated successfully", user : updatedUser}
    }
    async getCreatedChallenges(userId : number) {
        const user = await this.prismaService.user.findUnique({
            where : {
                id : userId,
            }
        })
        if(!user) {
            throw new BadRequestException('User not found');
        }
        const getUserCreatedChallenges = await this.prismaService.challenge.findMany({
            where : {
                creatorId : userId,
            },
            select : {
                title : true,
                description : true,
                creator : {
                    select : {
                        firstName : true,
                        lastName : true,
                    }
                },
                participants : {
                    select : {
                        user : {
                            select : {
                                firstName : true,
                                lastName : true,
                            }
                        }
                    }
                }
            }
        })
        return { message: 'Challenges retrieved successfully', challenges : getUserCreatedChallenges };
    }
}
