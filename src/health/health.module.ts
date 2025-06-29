import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    MongooseModule,
    ConfigModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}