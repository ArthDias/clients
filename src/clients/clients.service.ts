import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, QueryFilter } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    try {
      return await this.clientModel.create(createClientDto);
    } catch (error: unknown) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException('Email or document already exists');
      }
      throw error;
    }
  }

  async findById(id: string) {
    const client = await this.clientModel.findById(id).exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async remove(id: string) {
    const deletedClient = await this.clientModel.findByIdAndDelete(id).exec();

    if (!deletedClient) {
      throw new NotFoundException('Client not found');
    }
  }

  async findAll(query: GetClientsQueryDto) {
    const { pageNumber, pageSize } = this.parsePagination(query);
    const filter = this.buildFilter(query);

    const [data, total] = await Promise.all([
      this.clientModel
        .find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.clientModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      pageNumber,
      lastPage: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  private parsePagination(query: GetClientsQueryDto) {
    const pageNumber = Math.max(1, Number(query.pageNumber) || 1);
    const pageSize = Math.max(1, Number(query.pageSize) || 10);

    return { pageNumber, pageSize };
  }

  private buildFilter(query: GetClientsQueryDto): QueryFilter<ClientDocument> {
    const filter: QueryFilter<ClientDocument> = {};

    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.email) {
      filter.email = { $regex: query.email, $options: 'i' };
    }

    if (query.document) {
      filter.document = query.document;
    }

    return filter;
  }
}
