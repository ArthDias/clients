import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;

  let clientsService: {
    createClient: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    remove: jest.Mock;
    replace: jest.Mock;
  };

  const validObjectId = '507f191e810c19729de860ea';

  const mockCreateClientDto: CreateClientDto = {
    name: 'Arthur',
    email: 'arthur@email.com',
    document: '12345678900',
  };

  const mockCreatedClient = {
    _id: validObjectId,
    ...mockCreateClientDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQuery: GetClientsQueryDto = {
    pageNumber: '1',
    pageSize: '10',
    name: 'Arthur',
    email: 'arthur@email.com',
    document: '12345678900',
  };

  const mockPaginatedResponse = {
    data: [mockCreatedClient],
    total: 1,
    pageNumber: 1,
    pageSize: 10,
  };

  beforeEach(async () => {
    clientsService = {
      createClient: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
      replace: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: clientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service and return created client', async () => {
      clientsService.createClient.mockResolvedValue(mockCreatedClient);

      const result = await controller.create(mockCreateClientDto);

      expect(clientsService.createClient).toHaveBeenCalledTimes(1);
      expect(clientsService.createClient).toHaveBeenCalledWith(
        mockCreateClientDto,
      );
      expect(result).toEqual(mockCreatedClient);
    });

    it('should propagate exception thrown by service', async () => {
      const error = new HttpException('Conflict', HttpStatus.CONFLICT);
      clientsService.createClient.mockRejectedValue(error);
      await expect(controller.create(mockCreateClientDto)).rejects.toThrow(
        error,
      );

      expect(clientsService.createClient).toHaveBeenCalledTimes(1);
    });

    it('should forward invalid dto to service (no validation at controller level)', async () => {
      const invalidDto = {} as CreateClientDto;
      clientsService.createClient.mockResolvedValue(mockCreatedClient);
      await controller.create(invalidDto);

      expect(clientsService.createClient).toHaveBeenCalledWith(invalidDto);
    });

    it('should return undefined if service returns undefined', async () => {
      clientsService.createClient.mockResolvedValue(undefined);
      const result = await controller.create(mockCreateClientDto);
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should call service with query and return paginated result', async () => {
      clientsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(mockQuery);

      expect(clientsService.findAll).toHaveBeenCalledTimes(1);
      expect(clientsService.findAll).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return empty list when service returns empty result', async () => {
      const emptyResponse = {
        data: [],
        total: 0,
        pageNumber: 1,
        pageSize: 10,
      };

      clientsService.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll(mockQuery);

      expect(result).toEqual(emptyResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should propagate exception thrown by service', async () => {
      const error = new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      clientsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(mockQuery)).rejects.toThrow(error);

      expect(clientsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should forward empty query object to service', async () => {
      const emptyQuery = {} as GetClientsQueryDto;
      clientsService.findAll.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(emptyQuery);

      expect(clientsService.findAll).toHaveBeenCalledWith(emptyQuery);
    });

    it('should use spyOn to verify delegation behavior', async () => {
      const spy = jest
        .spyOn(clientsService, 'findAll')
        .mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(mockQuery);

      expect(spy).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('findById', () => {
    it('should call service and return client when id is valid', async () => {
      clientsService.findById.mockResolvedValue(mockCreatedClient);

      const result = await controller.findById(validObjectId);

      expect(clientsService.findById).toHaveBeenCalledTimes(1);
      expect(clientsService.findById).toHaveBeenCalledWith(validObjectId);
      expect(result).toEqual(mockCreatedClient);
    });

    it('should propagate exception thrown by service', async () => {
      const error = new NotFoundException('Client not found');
      clientsService.findById.mockRejectedValue(error);

      await expect(controller.findById(validObjectId)).rejects.toThrow(error);

      expect(clientsService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if service returns undefined', async () => {
      clientsService.findById.mockResolvedValue(undefined);
      const result = await controller.findById(validObjectId);

      expect(result).toBeUndefined();
    });

    it('should verify delegation using spyOn', async () => {
      const spy = jest
        .spyOn(clientsService, 'findById')
        .mockResolvedValue(mockCreatedClient);
      await controller.findById(validObjectId);

      expect(spy).toHaveBeenCalledWith(validObjectId);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return its result (successful deletion)', async () => {
      clientsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(validObjectId);

      expect(clientsService.remove).toHaveBeenCalledTimes(1);
      expect(clientsService.remove).toHaveBeenCalledWith(validObjectId);
      expect(result).toBeUndefined();
    });

    it('should propagate NotFoundException thrown by service', async () => {
      const error = new NotFoundException('Client not found');
      clientsService.remove.mockRejectedValue(error);

      await expect(controller.remove(validObjectId)).rejects.toThrow(error);

      expect(clientsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should propagate generic HttpException thrown by service', async () => {
      const error = new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      clientsService.remove.mockRejectedValue(error);

      await expect(controller.remove(validObjectId)).rejects.toThrow(error);
    });

    it('should verify delegation behavior using spyOn', async () => {
      const spy = jest
        .spyOn(clientsService, 'remove')
        .mockResolvedValue(undefined);

      await controller.remove(validObjectId);

      expect(spy).toHaveBeenCalledWith(validObjectId);
    });
  });

  describe('update', () => {
    const mockUpdateClientDto: UpdateClientDto = {
      name: 'Updated Name',
      email: 'updated@email.com',
      document: '99999999999',
    };

    const mockUpdatedClient = {
      _id: validObjectId,
      ...mockUpdateClientDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should call service.replace and return updated client (success flow)', async () => {
      clientsService.replace.mockResolvedValue(mockUpdatedClient);

      const result = await controller.update(
        validObjectId,
        mockUpdateClientDto,
      );

      expect(clientsService.replace).toHaveBeenCalledTimes(1);
      expect(clientsService.replace).toHaveBeenCalledWith(
        validObjectId,
        mockUpdateClientDto,
      );
      expect(result).toEqual(mockUpdatedClient);
    });

    it('should propagate NotFoundException thrown by service', async () => {
      const error = new NotFoundException('Client not found');
      clientsService.replace.mockRejectedValue(error);

      await expect(
        controller.update(validObjectId, mockUpdateClientDto),
      ).rejects.toThrow(error);

      expect(clientsService.replace).toHaveBeenCalledTimes(1);
    });

    it('should propagate generic HttpException thrown by service', async () => {
      const error = new HttpException(
        'Internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      clientsService.replace.mockRejectedValue(error);

      await expect(
        controller.update(validObjectId, mockUpdateClientDto),
      ).rejects.toThrow(error);

      expect(clientsService.replace).toHaveBeenCalledTimes(1);
    });

    it('should forward empty dto to service (no validation at controller level)', async () => {
      const emptyDto = {} as UpdateClientDto;
      clientsService.replace.mockResolvedValue(mockUpdatedClient);

      await controller.update(validObjectId, emptyDto);

      expect(clientsService.replace).toHaveBeenCalledWith(
        validObjectId,
        emptyDto,
      );
    });

    it('should return undefined if service returns undefined', async () => {
      clientsService.replace.mockResolvedValue(undefined);

      const result = await controller.update(
        validObjectId,
        mockUpdateClientDto,
      );

      expect(result).toBeUndefined();
    });

    it('should verify delegation behavior using spyOn', async () => {
      const spy = jest
        .spyOn(clientsService, 'replace')
        .mockResolvedValue(mockUpdatedClient);

      await controller.update(validObjectId, mockUpdateClientDto);

      expect(spy).toHaveBeenCalledWith(validObjectId, mockUpdateClientDto);
    });
  });
});
