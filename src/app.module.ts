import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'database/data';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
