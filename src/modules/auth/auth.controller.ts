import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RefreshAccessTokenDto } from 'src/modules/auth/dto/refresh-access-token.dto';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
// import { MailService } from 'src/modules/mail/mail.service';
import { UsersService } from 'src/modules/users/users.service';
import { IUserBaseInfo } from '../users/users.interface';
import { UserID } from 'src/shared/decorators/get-user-id.decorator';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService, // private readonly mailService: MailService,
  ) {}

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  async currentUser(@UserID() userId: string): Promise<IUserBaseInfo> {
    const user = await this.userService.findUserById(userId);
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseLogin> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-access-token')
  @ApiBody({
    type: RefreshAccessTokenDto,
  })
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<Partial<ResponseLogin>> {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
