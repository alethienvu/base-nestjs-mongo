import { Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';
import { TasksService } from './tasks.service';
import { AdminAndSuperAdmin } from 'src/modules/auth/guards/roles.guard';
import { TaskName } from './tasks.enum';

@Controller('schedules')
@ApiTags('Schedules')
@ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
export class ScheduleController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('')
  @ApiOperation({
    operationId: 'get-running-crons',
    description: 'Get all running crons',
    summary: 'Get all running crons',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @UseGuards(AdminAndSuperAdmin)
  getCrons() {
    return this.tasksService.getCrons();
  }

  @Post('stop/:task')
  @ApiOperation({
    operationId: 'stop-running-crons',
    description: 'Stop running crons',
    summary: 'Stop running crons',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @UseGuards(AdminAndSuperAdmin)
  terminateJob(@Param('task') task: TaskName) {
    return this.tasksService.stopJob(task);
  }

  @Post('restart/:task')
  @ApiOperation({
    operationId: 'restart-running-crons',
    description: 'Restart running crons',
    summary: 'Restart running crons',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @UseGuards(AdminAndSuperAdmin)
  restartJob(@Param('task') task: TaskName) {
    return this.tasksService.restartJob(task);
  }
}
