import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserID } from 'src/shared/decorators/get-user-id.decorator';
import { UpdatePassWordDto, UpdateUserDto } from './dtos/updateUser.dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'sign-up',
    description: 'Signup',
    summary: 'Signup',
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
  async updateUser(@UserID() id: string, @Body() updateUser: UpdateUserDto) {
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
  async changePass(@UserID() id: string, @Body() changePassWordDto: UpdatePassWordDto) {
    return await this.userService.changePassWord(id, changePassWordDto);
  }
}
