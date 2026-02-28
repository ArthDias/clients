import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients.dto';
import { PatchClientDto } from './dto/patch-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  async createClient(dto: CreateClientDto): Promise<ClientDocument> {
    return this.clientModel.create(dto);
  }

  async findAll(query: GetClientsQueryDto) {
    const { pageNumber, pageSize } = this.getPagination(query);
    const filter = this.buildFilter(query);

    const [data, total] = await Promise.all([
      this.clientModel
        .find(filter)
        .skip(this.calculateSkip(pageNumber, pageSize))
        .limit(pageSize)
        .exec(),
      this.clientModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      pageNumber,
      lastPage: this.calculateLastPage(total, pageSize),
    };
  }

  async findById(id: string): Promise<ClientDocument> {
    const client = await this.clientModel.findById(id).exec();
    return this.ensureFound(client);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.clientModel.findByIdAndDelete(id).exec();
    this.ensureFound(deleted);
  }

  async replace(id: string, dto: UpdateClientDto): Promise<ClientDocument> {
    return this.updateById(id, dto);
  }

  async patch(id: string, dto: PatchClientDto): Promise<ClientDocument> {
    return this.updateById(id, dto);
  }

  private async updateById(
    id: string,
    dto: UpdateClientDto | PatchClientDto,
  ): Promise<ClientDocument> {
    const updated = await this.clientModel
      .findByIdAndUpdate(id, dto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    return this.ensureFound(updated);
  }

  private ensureFound<T>(entity: T | null): T {
    if (!entity) {
      throw new NotFoundException('Client not found');
    }
    return entity;
  }

  private getPagination(query: GetClientsQueryDto) {
    return {
      pageNumber: query.pageNumber ?? 1,
      pageSize: query.pageSize ?? 10,
    };
  }

  private calculateSkip(pageNumber: number, pageSize: number): number {
    return (pageNumber - 1) * pageSize;
  }

  private calculateLastPage(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize));
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
