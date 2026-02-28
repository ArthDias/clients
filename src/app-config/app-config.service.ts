import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get mongoUri(): string {
    return this.config.getOrThrow<string>('MONGO_URI');
  }

  get port(): number {
    return this.config.getOrThrow<number>('PORT');
  }
}
