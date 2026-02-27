import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { MongoServerError } from 'mongodb';

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
}
