import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { AuthService, JwtPayload } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { User2 as User } from '../users/users.service';

@Controller('api/v1.0')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('auth')
  async signIn(@Body() body: Record<string, any>) {
    //TODO replace with DTO
    const { username, password } = body;

    return await this.authService.signIn(
      username as string,
      password as string,
    );
  }

  @Public()
  @Post('user')
  async signUp(@Body() body: Omit<User, 'id'>) {
    //TODO replace with DTO
    const { username, password } = body;

    return await this.authService.signUp({
      username,
      password,
    } as Omit<User, 'id'>);
  }

  @Get('auth')
  async getUser(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await this.authService.userFromPayload(req.user as JwtPayload);
    return user;
  }
}
