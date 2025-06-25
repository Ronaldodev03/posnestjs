import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  // una categoria tiene muchos productos
  @OneToMany(
    () => Product, // Category relacionado con Product
    (product) => product.category, // la informacion de la categoria se va a loadear en la property category de products"
    {
      cascade: true,
      //eager: true, // esto hace que los productos siempre se carguen automáticamente al obtener la category, se puede controlar en el servicio
    },
  )
  products: Product[];
}
