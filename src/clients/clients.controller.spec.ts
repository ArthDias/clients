import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;

  let clientsService: {
    createClient: jest.Mock;
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
    clientsService = {
      createClient: jest.fn(),
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
});
