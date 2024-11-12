import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async getInfoTransaction(idTransaction: string): Promise<Transactions | []> {
    if (!idTransaction) {
      throw new BadRequestException(
        'ID Transaction must is string or not empty',
      );
    }
    const info = this.transactionsRepository.findOne({
      where: { id: idTransaction },
    });
    return info ? info : [];
  }

  async getListByInput(address: string): Promise<Transactions[] | []> {
    if (!address) {
      throw new BadRequestException('Address must empty');
    }
    const data = this.transactionsRepository.find({
      where: [
        {
          from: address,
        },
        {
          to: address,
        },
        {
          id: address,
        },
      ],
    });
    return data;
  }

  async getListPaginate(
    address: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: Transactions[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    if (!address) {
      throw new BadRequestException('Address must empty');
    }
    const skip = (page - 1) * limit;
    const take = limit;
    const [results, total] = await this.transactionsRepository.findAndCount({
      where: [
        {
          from: address,
        },
        {
          to: address,
        },
        {
          id: address,
        },
      ],
      skip,
      take,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      items: results,
      currentPage: Number(page),
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async getAllFormTo(address: string): Promise<Transactions[] | []> {
    const data = await this.transactionsRepository.find({
      where: [
        {
          from: address,
        },
        {
          to: address,
        },
      ],
    });
    console.log(data.length);
    return data;
  }
}
