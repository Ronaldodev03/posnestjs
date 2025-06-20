import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    // const category = new Category()
    // category.name=createCategoryDto.name
    // return this.categoryRepository.save(category);
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const options: FindManyOptions<Category> = {
      where: {
        id,
      },
    };

    const category = await this.categoryRepository.findOne(options);
    if (!category) {
      // throw new HttpException('La Categoría no existe',404); // esta es generica y hay que colocar manualmente el status_code
      throw new NotFoundException('La Categoría no existe'); // esta es especifica y ya viene con status_code 404, asi como esta esta hay otras exceptions
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    category.name = updateCategoryDto.name;
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return 'Categoría Eliminada';
  }
}
