import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { EmailDto } from './dto/test-mail.dto';
import { ACCESS_TOKEN_HEADER_NAME } from 'src/shared/constants';
import { SentMessageInfo } from 'nodemailer';

@Controller('emails')
@ApiTags('emails')
@ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('')
  @ApiOperation({
    operationId: 'signup-emails',
    description: 'Signup emails',
    summary: 'Signup emails',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  createEmail(@Body() emailDto: EmailDto): Promise<SentMessageInfo> {
    return this.emailService.sendMail(emailDto);
  }
}
