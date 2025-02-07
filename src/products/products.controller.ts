import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProduct() {
    return this.productsService.getAllProduct();
  }

  @Get(':id')
  getProduct(@Param('id') id: number) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover_image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      cover_image?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    if (files.cover_image) {
      createProductDto.cover_image = files.cover_image[0];
    }

    if (files.images) {
      createProductDto.images = files.images;
    }

    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover_image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      cover_image?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    if (files.cover_image) {
      updateProductDto.cover_image = files.cover_image[0];
    }

    if (files.images) {
      updateProductDto.images = files.images;
    }

    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
