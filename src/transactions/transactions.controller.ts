import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('info/:id')
  async getInfoTransaction(
    @Param('id') idHash: string,
  ): Promise<Transactions | []> {
    return await this.transactionsService.getInfoTransaction(idHash);
  }
  @Get('list/:address')
  async getListByInput(
    @Param('address') address: string,
  ): Promise<[] | Transactions[]> {
    return await this.transactionsService.getListByInput(address);
  }
  @Get('paginate/:address')
  async getListPaginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('address') address: string,
  ): Promise<{
    items: Transactions[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    return await this.transactionsService.getListPaginate(address, page, limit);
  }
  @Get('all/:address')
  async getAllFormTo(
    @Param('address') address: string,
  ): Promise<Transactions[] | []> {
    return await this.transactionsService.getAllFormTo(address);
  }
}
