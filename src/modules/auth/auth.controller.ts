import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signUp.dto';
import { signInDto } from './dto/signIn.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService) {
    }

    @Throttle({default:{limit:1, ttl: 3000}})
    @Post('signUp')
    signUp(@Body() signUpDto : signUpDto) {
        return this.authService.signUp(signUpDto);
    }
    @Throttle({default:{limit:1, ttl: 3000}})
    @Post('signIn')
    signIn(@Body() signInDto : signInDto) {
        return this.authService.signIn(signInDto);
    }
}
