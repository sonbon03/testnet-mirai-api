import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'approvals', schema: 'app' })
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Transaction hash

  @Column({ type: 'bigint', nullable: true })
  blockHeight: number;

  @Column({ type: 'varchar', length: 255 })
  owner: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  spender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  approved: string;

  @Column({ type: 'bigint', nullable: true })
  value: number;

  @Column({ type: 'varchar', length: 255 })
  contractAddress: string;

  @Column({ type: 'bigint', nullable: true })
  tokenId: number;

  @Column({ type: 'varchar', length: 255 })
  typeApproval: string;
}
