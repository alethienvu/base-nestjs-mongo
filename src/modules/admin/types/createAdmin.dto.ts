import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from 'src/shared/enum/users.const';

export class CreateAdminDto {
  @ApiProperty({
    required: true,
    example: 'admin@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '123456@Abc',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}

export class LockUserDto {
  @ApiProperty({
    example: UserStatus.LOCKED,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;
}
