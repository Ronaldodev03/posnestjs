import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';

// custom pipe para validar que la url solo acepte numeros enteros, lo hacemos aqui para poder colocar un custom error message y poder usar esta clase en valrios metodos de los
// podriamos tan solo usar la clase ParseIntPipe, pero vendria con su default error message
@Injectable()
export class IdValidationPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('ID no válido'),
    });
  }
}
