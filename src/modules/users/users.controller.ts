import { Body, Controller, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserID } from '../../shared/decorators/user-id.decorator';
import { ForgotPassDto, UpdatePassWordDto, UpdateUserDto } from './dtos/updateUser.dto';
import { AUTH_HEADERS } from '../../shared/constants';
import { CommonErrorResponses } from 'src/shared/decorators/common-error.decorator';
import { TrimSpacePipe } from 'src/pipe/trim.pipe';

@Controller('user')
@ApiBearerAuth(AUTH_HEADERS.ACCESS_TOKEN)
@ApiTags('User')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'sign-up',
    description: 'Signup',
    summary: 'Signup',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.createUser(createUserDto);
    return createdUser;
  }

  @Put('/info')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'update',
    description: 'Update user infomation',
    summary: 'Update user infomation',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  async updateUser(@UserID() id: string, @Body(TrimSpacePipe) updateUser: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(id, updateUser);
    return updatedUser;
  }

  @Put('/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'change-password',
    description: 'Change password',
    summary: 'Change password',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async changePass(@UserID() id: string, @Body() changePassWordDto: UpdatePassWordDto) {
    return await this.userService.changePassWord(id, changePassWordDto);
  }

  @Put('/forgot-password')
  @ApiOperation({
    operationId: 'forgot-password',
    description: 'Forgot password',
    summary: 'Forgot password',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
  })
  async forgotPass(@Body() forgotPassDto: ForgotPassDto) {
    return await this.userService.forgotPass(forgotPassDto);
  }
}
