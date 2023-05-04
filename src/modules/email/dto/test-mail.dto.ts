import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'emailtest@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Subject',
    example: 'Email test',
  })
  subject: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Content',
    example: 'Hello world!',
  })
  content: string;
}
