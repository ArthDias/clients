import { PartialType } from '@nestjs/swagger';
import { UpdateClientDto } from './update-client.dto';

export class PatchClientDto extends PartialType(UpdateClientDto) {}
