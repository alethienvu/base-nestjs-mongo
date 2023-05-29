import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/shared/enum/users.const';
import { getEnumValues } from 'src/shared/utils';

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

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({
    type: Gender,
    enum: getEnumValues(Gender),
    description: 'Gender',
  })
  gender: Gender;

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
export class ForgotPassDto {
  @IsString()
  @ApiProperty({ required: true })
  readonly email: string;
}
