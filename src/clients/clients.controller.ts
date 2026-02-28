import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';
import { GetClientsQueryDto } from './dto/get-clients.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully.' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all items with pagination' })
  @ApiResponse({ status: 200, description: 'Return a list of items.' })
  findAll(@Query() query: GetClientsQueryDto) {
    return this.clientsService.findAll(query);
  }
}
