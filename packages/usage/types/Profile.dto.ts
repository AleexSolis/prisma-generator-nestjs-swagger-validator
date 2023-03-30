import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { IsNumber, IsString } from '@nestjs/class-validator'

export class ProfileDto {
  @ApiProperty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsString()
  userId: string
}

export class CreateProfileDto extends OmitType(ProfileDto, ['id']) {}

export class UpdateProfileDto extends PartialType(ProfileDto) {}
