import { Controller, Delete, Post, Param, UseGuards, Body, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAndSuperAdmin, OnlySuperAdmin } from '../auth/guards/roles.guard';
import { AdminService } from './admins.service';
import { CreateAdminDto, LockUserDto } from './types/createAdmin.dto';
import { IUser } from '../users/users.interface';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';

@Controller('admin')
@ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
@ApiTags('Admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/signup')
  @ApiOperation({
    operationId: 'sign-up',
    description: 'Admin create an user',
    summary: 'Admin create an user',
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
  async lockUser(@Param('id') id: string, @Body() lockUserDto: LockUserDto) {
    const isDeleted = await this.adminService.lockOrDeActiveUser(id, lockUserDto);
    return isDeleted;
  }
}
