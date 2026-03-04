import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // If we have auth, req.user may exist
    const userId = req.user?.id;
    if (userId) return `user:${userId}`;

    // Fallback to IP
    return `ip:${req.ip}`;
  }
}