import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoServerError } from 'mongodb';

import { Client } from './client.schema';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let model: {
    create: jest.Mock;
    find: jest.Mock;
    countDocuments: jest.Mock;
  };
  const mockClientModel = {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
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
      model.create.mockResolvedValue({} as any);

      await service.createClient({} as CreateClientDto);

      expect(model.create).toHaveBeenCalledWith({});
    });
  });

  describe('findAll', () => {
    const mockExec = jest.fn();

    const mockQueryChain = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: mockExec,
    };

    const mockQuery: GetClientsQueryDto = {
      pageNumber: '1',
      pageSize: '10',
      name: 'Arthur',
      email: 'arthur@email.com',
      document: '12345678900',
    };

    it('should return paginated result successfully', async () => {
      const mockData = [mockCreatedClient];
      model.find.mockReturnValue(mockQueryChain);
      model.countDocuments.mockResolvedValue(1);
      mockExec.mockResolvedValue(mockData);

      const result = await service.findAll(mockQuery);

      expect(model.find).toHaveBeenCalledTimes(1);
      expect(model.countDocuments).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        data: mockData,
        total: 1,
        pageNumber: 1,
        lastPage: 1,
      });
    });

    it('should calculate lastPage correctly when total > pageSize', async () => {
      model.find.mockReturnValue(mockQueryChain);
      model.countDocuments.mockResolvedValue(25);
      mockExec.mockResolvedValue([]);

      const query: GetClientsQueryDto = {
        pageNumber: '1',
        pageSize: '10',
      };

      const result = await service.findAll(query);

      expect(result.lastPage).toBe(3);
    });

    it('should default pagination when invalid values provided', async () => {
      model.find.mockReturnValue(mockQueryChain);
      model.countDocuments.mockResolvedValue(0);
      mockExec.mockResolvedValue([]);

      const query: GetClientsQueryDto = {
        pageNumber: 'invalid',
        pageSize: 'invalid',
      };

      const result = await service.findAll(query);

      expect(result.pageNumber).toBe(1);
      expect(result.lastPage).toBe(1);
    });

    it('should build filter correctly when name and email provided', async () => {
      model.find.mockReturnValue(mockQueryChain);
      model.countDocuments.mockResolvedValue(0);
      mockExec.mockResolvedValue([]);

      const spy = jest.spyOn(model, 'find');

      await service.findAll(mockQuery);

      expect(spy).toHaveBeenCalledWith({
        name: { $regex: 'Arthur', $options: 'i' },
        email: { $regex: 'arthur@email.com', $options: 'i' },
        document: '12345678900',
      });
    });

    it('should return lastPage as 1 when total is 0', async () => {
      model.find.mockReturnValue(mockQueryChain);
      model.countDocuments.mockResolvedValue(0);
      mockExec.mockResolvedValue([]);

      const result = await service.findAll({});

      expect(result.lastPage).toBe(1);
    });

    it('should propagate errors from database', async () => {
      model.find.mockImplementation(() => {
        throw new Error('Database failure');
      });

      await expect(service.findAll({})).rejects.toThrow('Database failure');
    });
  });
});
