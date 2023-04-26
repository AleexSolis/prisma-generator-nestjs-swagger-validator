import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from '@nestjs/class-validator';
export class UserDto {
  @ApiProperty()
  @IsNumber()
  id: number;
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  dob: any;
}
export class CreateUserDto extends OmitType(UserDto, ['id']) {}
export class UpdateUserDto extends PartialType(UserDto) {}
