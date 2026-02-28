import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsCPF } from 'src/common/validators/is-cpf.validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'The client full name',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @ApiProperty({
    description: 'The client email',
    example: 'joao@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email!: string;

  @ApiProperty({
    description: 'CPF (numbers only or formatted)',
    example: '12345678909',
  })
  @IsString()
  @IsNotEmpty()
  @IsCPF()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  document!: string;
}
