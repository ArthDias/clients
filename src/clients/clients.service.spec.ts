import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoServerError } from 'mongodb';

import { Client } from './client.schema';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let model: {
    create: jest.Mock;
  };
  const mockClientModel = {
    create: jest.fn(),
  };

  const mockCreateClientDto: CreateClientDto = {
    name: 'Arthur',
    email: 'arthur@email.com',
    document: '12345678900',
  };

  const mockCreatedClient = {
    _id: 'mock-id',
    ...mockCreateClientDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getModelToken(Client.name),
          useValue: mockClientModel,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    model = module.get(getModelToken(Client.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create and return a client successfully', async () => {
      model.create.mockResolvedValue(mockCreatedClient);

      const result = await service.createClient(mockCreateClientDto);

      expect(model.create).toHaveBeenCalledTimes(1);
      expect(model.create).toHaveBeenCalledWith(mockCreateClientDto);
      expect(result).toEqual(mockCreatedClient);
    });

    it('should throw ConflictException when duplicate key error occurs', async () => {
      const mongoError = new MongoServerError({
        message: 'E11000 duplicate key error',
      });
      mongoError.code = 11000;

      model.create.mockRejectedValue(mongoError);

      await expect(service.createClient(mockCreateClientDto)).rejects.toThrow(
        ConflictException,
      );

      await expect(service.createClient(mockCreateClientDto)).rejects.toThrow(
        'Email or document already exists',
      );
    });

    it('should rethrow unexpected errors', async () => {
      const unexpectedError = new Error('Database down');
      model.create.mockRejectedValue(unexpectedError);

      await expect(service.createClient(mockCreateClientDto)).rejects.toThrow(
        unexpectedError,
      );
    });

    it('should pass empty object to model (no validation at service level)', async () => {
      // Arrange
      model.create.mockResolvedValue({} as any);

      await service.createClient({} as CreateClientDto);

      expect(model.create).toHaveBeenCalledWith({});
    });
  });
});
