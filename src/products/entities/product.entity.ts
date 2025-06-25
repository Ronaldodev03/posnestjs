import { Category } from '../../categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    default: 'default.svg',
  })
  image: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  inventory: number;

  // un producto pertenece a una categoria
  @ManyToOne(
    () => Category, // Product relacionado con Category
    (category) => category.products, // la informacion de la products se va a loadear en la property products de category
    { onDelete: 'CASCADE' }, // si elimino la category entonces se eliminan los products
  )
  category: Category;

  @Column({ type: 'int' })
  categoryId: number; // util para tener el id de la category sin tener que cragar la relacion en la peticion
}
