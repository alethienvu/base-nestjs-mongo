import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { EmailDto } from './dto/test-mail.dto';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';
import { SentMessageInfo } from 'nodemailer';

@Controller('emails')
@ApiTags('Emails')
@ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
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
  sendSignupMail(@Body() emailDto: EmailDto): Promise<SentMessageInfo> {
    return this.emailService.sendSignupMail(emailDto);
  }

  @Post('all')
  @ApiOperation({
    operationId: 'send-all-signup-emails',
    description: 'Trigger send signup email to all users',
    summary: 'Trigger send signup email to all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  sendSignupMailAll() {
    return this.emailService.sendAllEmail();
  }
}
