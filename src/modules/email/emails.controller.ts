import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { EmailDto } from './dto/test-mail.dto';
import { AUTH_HEADERS } from 'src/shared/constants';
import { SentMessageInfo } from 'nodemailer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommonErrorResponses } from 'src/shared/decorators/common-error.decorator';

@Controller('emails')
@ApiTags('Emails')
@ApiBearerAuth(AUTH_HEADERS.ACCESS_TOKEN)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('')
  @ApiOperation({
    operationId: 'send-signup-emails',
    description: 'Send signup emails',
    summary: 'Send signup emails',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  @UseGuards(JwtAuthGuard)
  sendSignupMail(@Body() emailDto: EmailDto): Promise<SentMessageInfo> {
    return this.emailService.sendSignupMail(emailDto);
  }

  @Post('all')
  @ApiOperation({
    operationId: 'send-all-signup-emails',
    description: 'Trigger send signup email to all users',
    summary: 'Trigger send signup email to all users',
  })
  @CommonErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @UseGuards(JwtAuthGuard)
  sendSignupMailAll() {
    return this.emailService.sendAllEmail();
  }
}
