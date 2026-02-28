import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients.dto';
import { UpdateClientDto } from './dto/update-client.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  @ApiResponse({ status: 200, description: 'Client found.' })
  findById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.clientsService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client by id' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Client deleted successfully.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.clientsService.remove(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client by id' })
  @ApiResponse({ status: 200, description: 'Client updated successfully.' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.replace(id, updateClientDto);
  }
}
