import { BadRequestException } from '@nestjs/common';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

describe('ParseObjectIdPipe', () => {
  let pipe: ParseObjectIdPipe;

  beforeEach(() => {
    pipe = new ParseObjectIdPipe();
  });

  it('should return the value when ObjectId is valid', () => {
    const validId = '507f191e810c19729de860ea';

    const result = pipe.transform(validId);

    expect(result).toBe(validId);
  });

  it('should throw BadRequestException when ObjectId is invalid', () => {
    const invalidId = 'invalid-id';

    expect(() => pipe.transform(invalidId)).toThrow(BadRequestException);

    expect(() => pipe.transform(invalidId)).toThrow('Invalid ID');
  });

  it('should throw exception for empty string', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });

  it('should throw exception for undefined value', () => {
    expect(() => pipe.transform(undefined as unknown as string)).toThrow(
      BadRequestException,
    );
  });
});
