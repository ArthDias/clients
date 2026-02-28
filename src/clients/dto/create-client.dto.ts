import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'The client name', required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'The client email', required: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'The client document', required: true })
  @IsString()
  @IsNotEmpty()
  document!: string;
}
