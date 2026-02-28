import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';
import { isDuplicateKeyError } from '../types/mongo.types';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (isDuplicateKeyError(exception)) {
      const field = Object.keys(exception.keyPattern)[0];

      return response.status(409).json({
        statusCode: 409,
        message: `${field} already exists`,
        error: 'Conflict',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Database error',
      error: 'Internal Server Error',
    });
  }
}
