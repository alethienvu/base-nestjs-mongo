import { Controller, Delete, Post, Param, UseGuards, Body, Put, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAndSuperAdmin, OnlySuperAdmin } from '../auth/guards/roles.guard';
import { AdminService } from './admins.service';
import { CreateAdminDto, LockUserDto } from './types/createAdmin.dto';
import { IUser } from '../users/users.interface';
import { AUTH_HEADERS } from 'src/shared/constants';
import { CommonErrorResponses } from 'src/shared/common-swagger';

@Controller('admin')
@ApiBearerAuth(AUTH_HEADERS.ACCESS_TOKEN)
@ApiTags('Admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'sign-up',
    description: 'Admin create an user',
    summary: 'Admin create an user',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @UseGuards(AdminAndSuperAdmin)
  async signUp(@Body() createAdminDto: CreateAdminDto): Promise<IUser> {
    const createdUser = await this.adminService.createAdmin(createAdminDto);
    return createdUser;
  }

  @Delete('/:id')
  @UseGuards(OnlySuperAdmin)
  @ApiOperation({
    operationId: 'admin-delete-user',
    description: 'Admin delete an user',
    summary: 'Admin delete an user',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async deleteUser(@Param('id') id: string) {
    const isDeleted = await this.adminService.deleteUser(id);
    return isDeleted;
  }

  @Put('/:id')
  @UseGuards(AdminAndSuperAdmin)
  @ApiOperation({
    operationId: 'admin-change-status-user',
    description: 'Admin change status an user',
    summary: 'Admin change status an user',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async lockUser(@Param('id') id: string, @Body() lockUserDto: LockUserDto) {
    const isDeleted = await this.adminService.lockOrDeActiveUser(id, lockUserDto);
    return isDeleted;
  }
}
