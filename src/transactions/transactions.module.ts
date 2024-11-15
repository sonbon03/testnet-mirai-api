import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transaction.entity';
import { Approval } from './entities/approval.entity';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions, Approval])],
  controllers: [TransactionsController],
  providers: [TransactionsService, RedisService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
