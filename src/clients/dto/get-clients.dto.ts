import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetClientsQueryDto {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: 'The page number', required: false, default: 1 })
  pageNumber?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: 'The page size', required: false, default: 10 })
  pageSize?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The client name', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The client email', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The client document', required: false })
  document?: string;
}
