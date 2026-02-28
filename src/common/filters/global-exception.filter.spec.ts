import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { PinoLogger } from 'nestjs-pino';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  let mockLogger: jest.Mocked<PinoLogger>;

  let mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
  };

  let mockRequest: {
    url: string;
  };

  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
      fatal: jest.fn(),
      setContext: jest.fn(),
      assign: jest.fn(),
    } as unknown as jest.Mocked<PinoLogger>;
    filter = new GlobalExceptionFilter(mockLogger);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-route',
    };

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException(
      { error: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-route',
        message: { error: 'Bad Request' },
      }),
    );
  });

  it('should handle generic errors as 500', () => {
    const exception = new Error('Unexpected failure');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-route',
        message: 'Internal server error',
      }),
    );
  });
});
