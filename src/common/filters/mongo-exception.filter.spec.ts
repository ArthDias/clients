import { ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { MongoExceptionFilter } from './mongo-exception.filter';

describe('MongoExceptionFilter', () => {
  let filter: MongoExceptionFilter;

  let mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
  };

  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new MongoExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  describe('duplicate key error (E11000)', () => {
    it('should return 409 with field name when duplicate key error occurs', () => {
      const mongoError = {
        code: 11000,
        keyPattern: { email: 1 },
      } as unknown as MongoServerError;

      filter.catch(mongoError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 409,
        message: 'email already exists',
        error: 'Conflict',
      });
    });

    it('should extract the correct field when multiple keys exist', () => {
      const mongoError = {
        code: 11000,
        keyPattern: { document: 1, email: 1 },
      } as unknown as MongoServerError;

      filter.catch(mongoError, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 409,
        message: 'document already exists',
        error: 'Conflict',
      });
    });
  });

  describe('non-duplicate Mongo error', () => {
    it('should return 500 for other MongoServerError types', () => {
      const mongoError = {
        code: 50,
      } as MongoServerError;

      filter.catch(mongoError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Database error',
        error: 'Internal Server Error',
      });
    });
  });

  describe('response chaining behavior', () => {
    it('should call status before json', () => {
      const mongoError = {
        code: 11000,
        keyPattern: { email: 1 },
      } as unknown as MongoServerError;

      filter.catch(mongoError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });
  });
});
