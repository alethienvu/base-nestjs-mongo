import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserID } from '../../shared/decorators/user-id.decorator';
import { ForgotPassDto, UpdatePassWordDto, UpdateUserDto } from './dtos/updateUser.dto';
import { AUTH_HEADERS, MaxImgSize, allowFileType } from '../../shared/constants';
import { CommonErrorResponses } from 'src/shared/decorators/common-error.decorator';
import { TrimSpacePipe } from 'src/pipe/trim.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
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

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'postAvatar',
    description: 'Update user avatar',
    summary: 'Update user avatar',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @UserID() id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MaxImgSize }),
          new FileTypeValidator({ fileType: allowFileType }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const avatar = await this.userService.updateAvatar(id, file);
    return avatar;
  }

  @Get('avatar')
  @ApiOperation({
    operationId: 'getAvatar',
    description: 'Get user avatar',
    summary: 'Get user avatar',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
  })
  async getFile(@UserID() id: string, @Res() res: Response) {
    const fileStream = await this.userService.getStreamAvatarById(id);
    res.set(fileStream.headers);
    fileStream.stream.pipe(res);
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
