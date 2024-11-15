import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    private readonly redisService: RedisService,
  ) {}

  async getInfoTransaction(idTransaction: string): Promise<any> {
    if (!idTransaction) {
      throw new BadRequestException(
        'ID Transaction must is string or not empty',
      );
    }
    const transactionRedis = await this.redisService.get(
      'transactions:001',
      idTransaction,
    );

    if (!transactionRedis) {
      const info = await this.transactionsRepository.findOne({
        where: { id: idTransaction },
      });
      await this.redisService.set(
        'transactions:001',
        idTransaction,
        JSON.stringify(info),
        360,
      );
      return info;
    } else {
      return JSON.parse(transactionRedis);
    }
  }

  async getListByInput(address: string): Promise<Transactions[] | []> {
    if (!address) {
      throw new BadRequestException('Address must empty');
    }

    const inputAdress = await this.redisService.get(
      'input_adress:001',
      address,
    );

    if (!inputAdress) {
      const data = await this.transactionsRepository.find({
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
      await this.redisService.set(
        'input_adress:001',
        address,
        JSON.stringify(data),
        360,
      );
      return data;
    } else {
      return JSON.parse(inputAdress);
    }
  }

  async getListPaginate(
    address: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    if (!address) {
      throw new BadRequestException('Address must empty');
    }
    const pageRedis = await this.redisService.get('page_data', address, page);
    if (pageRedis) {
      const data = JSON.parse(pageRedis);
      return {
        items: data[0],
        currentPage: Number(page),
        totalPages: data[1],
        totalItems: data[2],
      };
    } else {
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
      const data = [results, totalPages, total];
      await this.redisService.set(
        `page_data`,
        address,
        JSON.stringify(data),
        20,
        page,
      );

      return {
        items: results,
        currentPage: Number(page),
        totalPages: totalPages,
        totalItems: total,
      };
    }
  }

  async getAllFormTo(address: string): Promise<Transactions[] | []> {
    if (!address) {
      throw new BadRequestException('Address must empty');
    }
    const adressFromTo = await this.redisService.get(`allFormTo:001`, address);
    if (adressFromTo) {
      return JSON.parse(adressFromTo);
    } else {
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
      await this.redisService.set(
        `allFormTo:001`,
        address,
        JSON.stringify(data),
        360,
      );
      return data;
    }
  }
}
