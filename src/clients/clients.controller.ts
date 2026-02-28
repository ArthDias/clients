import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ClientsService } from './clients.service';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients.dto';
import { PaginatedClientsResponseDto } from './dto/paginated-clients-response.dto';
import { PatchClientDto } from './dto/patch-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new client',
    description:
      'Creates a new client with name, email and CPF. Email and CPF must be unique.',
  })
  @ApiCreatedResponse({
    description: 'Client created successfully.',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body.',
  })
  @ApiConflictResponse({
    description: 'Email or CPF already exists.',
  })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List clients with pagination and filters',
    description:
      'Returns a paginated list of clients. Supports filtering by name, email and CPF.',
  })
  @ApiOkResponse({
    description: 'Paginated list of clients returned successfully.',
    type: PaginatedClientsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters.',
  })
  findAll(@Query() query: GetClientsQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get client by id',
    description: 'Returns a single client by its MongoDB ObjectId.',
  })
  @ApiOkResponse({
    description: 'Client found successfully.',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId format.',
  })
  @ApiNotFoundResponse({
    description: 'Client not found.',
  })
  findById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.clientsService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete client by id',
    description: 'Deletes a client permanently by its id.',
  })
  @ApiNoContentResponse({
    description: 'Client deleted successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId format.',
  })
  @ApiNotFoundResponse({
    description: 'Client not found.',
  })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.clientsService.remove(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Fully replace a client by id',
    description:
      'Replaces all client fields. Requires full payload (name, email and CPF).',
  })
  @ApiOkResponse({
    description: 'Client fully replaced successfully.',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId or invalid request body.',
  })
  @ApiNotFoundResponse({
    description: 'Client not found.',
  })
  @ApiConflictResponse({
    description: 'Email or CPF already exists.',
  })
  replace(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.replace(id, updateClientDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update a client by id',
    description: 'Updates only the fields provided in the request body.',
  })
  @ApiOkResponse({
    description: 'Client partially updated successfully.',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ObjectId or invalid request body.',
  })
  @ApiNotFoundResponse({
    description: 'Client not found.',
  })
  @ApiConflictResponse({
    description: 'Email or CPF already exists.',
  })
  patch(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() patchClientDto: PatchClientDto,
  ) {
    return this.clientsService.patch(id, patchClientDto);
  }
}
