import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'The client name',
    required: true,
    example: 'João Pessoa',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'The client email',
    required: true,
    example: 'joao.pessoa@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'The client document',
    required: true,
    example: '12345678900',
  })
  @IsString()
  @IsNotEmpty()
  document!: string;
}
