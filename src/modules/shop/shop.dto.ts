import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/adapters/pagination/pagination.dto';
import { ShopStatus } from 'src/shared/enum/shop.const';
import { getEnumValues } from 'src/shared/utils';

export class CreateShopDto {
  @ApiProperty({
    required: true,
    example: 'Shopee, Lazada,...',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    example: '9188d573-4d92-48fc-bb1b-9081a12855c3',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    required: true,
    example: 'Ba Dinh, Ha Noi',
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    required: true,
    example: 'https://i.pinimg.com/564x/6d/cc/b8/6dccb826a85aa80cf9660a746ed8e3ba.jpg',
  })
  @IsString()
  @IsOptional()
  avatar: string;
}

export class IndexShopInput extends PaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Shop id',
  })
  id: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: '(Shop name)',
  })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'id',
  })
  userId?: string;

  @IsOptional()
  @IsEnum(ShopStatus)
  @ApiPropertyOptional({
    type: ShopStatus,
    enum: getEnumValues(ShopStatus),
    description: 'Statuses',
  })
  status?: ShopStatus;
}
