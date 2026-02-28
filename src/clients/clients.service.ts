import { ConflictException, Injectable } from '@nestjs/common';
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

  async findAll(query: GetClientsQueryDto) {
    const pageNumber = Number(query.pageNumber) || 1;
    const pageSize = Number(query.pageSize) || 10;

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
      lastPage: Math.ceil(total / pageSize),
    };
  }
}
