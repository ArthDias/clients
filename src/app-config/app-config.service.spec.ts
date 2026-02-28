import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let configService: {
    getOrThrow: jest.Mock;
  };
  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mongoUri getter', () => {
    it('should return mongo uri from config service', () => {
      configService.getOrThrow.mockReturnValue('mongodb://localhost:27017');

      const result = service.mongoUri;

      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('MONGO_URI');
      expect(result).toBe('mongodb://localhost:27017');
    });

    it('should throw error if MONGO_URI is not defined', () => {
      const error = new Error('MONGO_URI not defined');
      configService.getOrThrow.mockImplementation(() => {
        throw error;
      });

      expect(() => service.mongoUri).toThrow(error);
    });
  });

  describe('port getter', () => {
    it('should return port from config service', () => {
      configService.getOrThrow.mockReturnValue(3000);

      const result = service.port;

      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('PORT');
      expect(result).toBe(3000);
    });

    it('should throw error if PORT is not defined', () => {
      const error = new Error('PORT not defined');
      configService.getOrThrow.mockImplementation(() => {
        throw error;
      });

      expect(() => service.port).toThrow(error);
    });

    it('should return whatever value config service provides (no type validation)', () => {
      configService.getOrThrow.mockReturnValue('3000' as any);
      const result = service.port;
      expect(result).toBe('3000');
    });
  });
});
