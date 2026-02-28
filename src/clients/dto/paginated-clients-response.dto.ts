import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from './client-response.dto';

export class PaginatedClientsResponseDto {
  @ApiProperty({ type: [ClientResponseDto] })
  data!: ClientResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  pageNumber!: number;

  @ApiProperty()
  lastPage!: number;
}
