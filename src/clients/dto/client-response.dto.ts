import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  document!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
