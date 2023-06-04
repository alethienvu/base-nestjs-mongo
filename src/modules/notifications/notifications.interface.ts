import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDocument } from 'src/shared/mongo.helper';

export interface ISubcriptions {
  endpoint: string;
  expirationTime?: number | null;
  keys: ISubOptions;
}
export interface ISubOptions {
  p256dh: string;
  auth: string;
}
export interface INotifs extends BaseDocument, ISubcriptions {}
export class CreateSubcriptionsDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @ApiPropertyOptional({
    required: true,
    example: '10000',
  })
  expirationTime: number | null;

  @ApiProperty({
    required: true,
    type: Object,
  })
  keys: ISubOptions;
}
