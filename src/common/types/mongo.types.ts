import { MongoServerError } from 'mongodb';

export interface MongoDuplicateKeyError extends MongoServerError {
  keyPattern: Record<string, number>;
  keyValue: Record<string, unknown>;
}

export function isDuplicateKeyError(
  error: MongoServerError,
): error is MongoDuplicateKeyError {
  return error.code === 11000 && !!error.keyPattern;
}
