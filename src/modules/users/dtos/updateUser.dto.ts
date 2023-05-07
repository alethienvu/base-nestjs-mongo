import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/shared/enum/users.const';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly first_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly last_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly phone?: string;

  @ApiProperty({
    example: Gender.Male,
  })
  @IsEnum(Gender)
  @IsOptional()
  status: Gender;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
  })
  dateOfBirth?: string;
}

export class UpdatePassWordDto {
  @IsString()
  @ApiProperty({ required: true })
  readonly currently_pass: string;

  @IsString()
  @ApiProperty({ required: true })
  readonly new_pass: string;
}
