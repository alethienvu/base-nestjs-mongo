import { Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_HEADERS } from 'src/shared/constants';
import { TasksService } from './tasks.service';
import { AdminAndSuperAdmin } from 'src/modules/auth/guards/roles.guard';
import { TaskName } from './tasks.enum';
import { CommonErrorResponses } from 'src/shared/common-swagger';

@Controller('schedules')
@ApiTags('Schedules')
@ApiBearerAuth(AUTH_HEADERS.ACCESS_TOKEN)
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
  @CommonErrorResponses()
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
  @CommonErrorResponses()
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
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @CommonErrorResponses()
  @UseGuards(AdminAndSuperAdmin)
  restartJob(@Param('task') task: TaskName) {
    return this.tasksService.restartJob(task);
  }
}
