import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ChatDto } from './dto/chat.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}
    
    @Post()
    async chat(@Body() chatDto: ChatDto, @Request() req: any) {
        return this.chatService.chat(req.user.id, chatDto);
    }
}
