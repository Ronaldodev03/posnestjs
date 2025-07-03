import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CouponsModule } from './coupons/coupons.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para acceder a variables de entorno en toda la app
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService], // esto es para tener acceso a las variables de entorno en typeorm.config.ts
    }),
    CategoriesModule,
    ProductsModule,
    TransactionsModule,
    CouponsModule,
    //   SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
