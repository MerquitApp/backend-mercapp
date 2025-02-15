import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos productos',
    description: 'Obtiene una lista de todos los productos.',
  })
  getAllProduct() {
    return this.productsService.getAllProduct();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto',
    description: 'Obtiene la información de un producto por su ID.',
  })
  @ApiResponse({ status: 200, description: 'Información del producto.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  getProduct(@Param('id') id: number) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover_image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  @ApiOperation({
    summary: 'Crear un producto',
    description: 'Crea un nuevo producto con la información proporcionada.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del producto a crear',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Producto 1' },
        description: { type: 'string', example: 'Descripción del producto' },
        price: { type: 'number', example: 100 },
        cover_image: { type: 'string', format: 'binary' },
        tags: { type: 'array', items: { type: 'string' } },
        categories: { type: 'array', items: { type: 'string' } },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      cover_image?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },

    @Req() req,
  ) {
    const user = req.user;

    if (files.cover_image) {
      createProductDto.cover_image = files.cover_image[0];
    }

    if (files.images) {
      createProductDto.images = files.images;
    }

    return this.productsService.createProduct(createProductDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover_image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  @ApiOperation({
    summary: 'Actualizar un producto',
    description: 'Actualiza la información de un producto existente.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos actualizados del producto',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Producto actualizado' },
        description: { type: 'string', example: 'Nueva descripción' },
        price: { type: 'number', example: 150 },
        cover_image: { type: 'string', format: 'binary' },
        tags: { type: 'array', items: { type: 'string' } },
        categories: { type: 'array', items: { type: 'string' } },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
    @UploadedFiles()
    files: {
      cover_image?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const user = req.user;

    if (files.cover_image) {
      updateProductDto.cover_image = files.cover_image[0];
    }

    if (files.images) {
      updateProductDto.images = files.images;
    }

    return this.productsService.updateProduct(id, updateProductDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un producto',
    description: 'Elimina un producto por su ID.',
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  deleteProduct(@Param('id') id: number, @Req() req) {
    const user = req.user;

    return this.productsService.deleteProduct(id, user);
  }
}
