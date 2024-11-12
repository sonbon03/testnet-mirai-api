import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions', schema: 'app' })
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Transaction hash

  @Column({ type: 'bigint', nullable: true })
  block_height: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  to: string;

  @Column({ type: 'varchar', length: 255 })
  from: string;

  @Column({ type: 'bigint', nullable: true })
  value: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contract_address: string;

  @Column({ type: 'bigint', nullable: true })
  token_id: number;

  @Column({ type: 'varchar', length: 255 })
  type_transaction: string;
}
