import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  total: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  coupon: string;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  discount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  transactionDate: Date;

  // una "Transaction" tiene multiples "TransactionContents"
  @OneToMany(
    () => TransactionContents, // Transaction relacionado con TransactionContents
    (transactionContent) => transactionContent.transaction, // la informacion de la "transaccion" se va a loader en la property "transaction" de la tabla "transactionContent"
  )
  contents: TransactionContents[];
}

@Entity()
export class TransactionContents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;

  // un "TransactionContent" pertenece a un "Product"
  @ManyToOne(
    () => Product, // TransactionContent relacionado con Product
    {
      cascade: true,
      eager: true, // 'eager: true' means "products" will be automatically loaded with "transactionContents"
    },
  )
  product: Product;

  // un "TransactionContent" pertenece a una "Transaction"
  @ManyToOne(
    () => Transaction, // TransactionContents relacionado con Transaction
    (transaction) => transaction.contents, // la informacion de la "transaccionContents" se va a loader en la property "contents" de la tabla "transaction"
    {
      cascade: true,
      onDelete: 'CASCADE', // si elimino la transaccion tambien se elimina el contenido
    },
  )
  transaction: Transaction;
}
