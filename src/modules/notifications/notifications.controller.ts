import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonErrorResponses } from 'src/shared/decorators/common-error.decorator';
import { NotificationsService } from './notifications.service';
import { CreateSubcriptionsDto } from './notifications.interface';
import { AdminAndSuperAdmin } from '../auth/guards/roles.guard';
import { AUTH_HEADERS } from 'src/shared/constants';

@Controller('notifications')
@ApiBearerAuth(AUTH_HEADERS.ACCESS_TOKEN)
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly _notificationsService: NotificationsService) {}

  @Post('/add-subscription')
  @ApiOperation({
    operationId: 'add-subscription',
    description: 'add-subscription',
    summary: 'add-subscription',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  addSubcription(@Body() createSubcriptionsDto: CreateSubcriptionsDto) {
    return this._notificationsService.addSubcription(createSubcriptionsDto);
  }

  @Post('/remove-subscription')
  @ApiOperation({
    operationId: 'remove-subscription',
    description: 'remove-subscription',
    summary: 'remove-subscription',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  removeSubcription(@Body() createSubcriptionsDto: CreateSubcriptionsDto) {
    return this._notificationsService.removeSubcription(createSubcriptionsDto);
  }

  @Post('/notifyAll')
  @UseGuards(AdminAndSuperAdmin)
  @ApiOperation({
    operationId: 'notifyAll',
    description: 'notifyAll',
    summary: 'notifyAll',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  notifyAll() {
    return this._notificationsService.notifyAll();
  }
}
