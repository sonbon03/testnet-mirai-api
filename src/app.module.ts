import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TransactionsModule],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
