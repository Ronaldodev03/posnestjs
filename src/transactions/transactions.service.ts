import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // creamos una transation de nestjs ".manager.transation"
    // si falla algo entonces la transaction marcara un error
    // con el entity "manager" (.manager.transation) se puede create/save/update... de cualquier entidad entidad
    // En TypeORM, el EntityManager es una sola instancia que gestiona todas las entidades. No importa de qué repositorio accedas al manager, siempre será el mismo.
    // probablemente se eligió productRepository porque la transacción principalmente afecta a productos (actualizando su inventario), pero podría haber elegido cualquiera de los otros.
    await this.productRepository.manager.transaction(
      // este transactionEntityManager es el entityManager
      async (transactionEntityManager) => {
        const transaction = new Transaction();

        // total de la transaccion
        const total = createTransactionDto.contents.reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        );
        transaction.total = total;

        // para cada content se aplica el codigo del for
        for (const contents of createTransactionDto.contents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: contents.productId,
          });

          const errors: string[] = [];

          // verifico si el product existe
          if (!product) {
            errors.push(
              `El producto con el ID: ${contents.productId} no existe`,
            );
            throw new NotFoundException(errors);
          }

          // verifico que la quantity sea inferior al inveory, si si es entonces reduzco el inventory
          if (contents.quantity > product.inventory) {
            errors.push(
              `El artículo ${product.name} excede la cantidad disponible`,
            );
            throw new BadRequestException(errors);
          }
          product.inventory -= contents.quantity;

          // Create TransactionContents instance
          const transactionContent = new TransactionContents();
          transactionContent.price = contents.price;
          transactionContent.product = product;
          transactionContent.quantity = contents.quantity;
          transactionContent.transaction = transaction;

          await transactionEntityManager.save(transaction);
          await transactionEntityManager.save(transactionContent);
        }
      },
    );

    return { message: 'Venta Almacenada Correctamente' };
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true,
      },
    };

    // filtrar por fecha
    if (transactionDate) {
      const date = parseISO(transactionDate);

      if (!isValid(date)) {
        throw new BadRequestException('Fecha no válida');
      }

      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        transactionDate: Between(start, end),
      };
    }
    return this.transactionRepository.find(options);
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
