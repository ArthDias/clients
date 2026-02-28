import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { IsCPF } from '../../common/validators/is-cpf.validator';

export class GetClientsQueryDto {
  @ApiPropertyOptional({
    description: 'The page number (starts at 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;

  @ApiPropertyOptional({
    description: 'The page size (max 100)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Filter by client name (partial match)',
    example: 'Arthur',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by client email (partial match)',
    example: 'arthur@email.com',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by CPF (numbers only)',
    example: '12345678901',
  })
  @IsOptional()
  @IsCPF()
  document?: string;
}
