import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ObjectStorageService } from 'src/object-storage/object-storage.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Prisma, Product, User } from '@prisma/client';
import { ProductImagesService } from 'src/product-images/product-images.service';

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    categories: true;
    images: true;
    cover_image: true;
    user: true;
  };
}>;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly objectStorageService: ObjectStorageService,
    private readonly categoriesService: CategoriesService,
    private readonly productImageService: ProductImagesService,
  ) {}

  async getProductById(id: number): Promise<ProductWithRelations> {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        images: true,
        cover_image: true,
        user: true,
      },
    });
  }

  async getAllProduct(): Promise<ProductWithRelations[]> {
    return await this.prisma.product.findMany({
      include: {
        categories: true,
        images: true,
        cover_image: true,
        user: true,
      },
    });
  }

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<ProductWithRelations | null> {
    try {
      const cover_img_url = await this.objectStorageService.uploadFile(
        createProductDto.cover_image,
      );

      let images_url = [];

      if (createProductDto.images && createProductDto.images.length > 0) {
        images_url = await Promise.all(
          createProductDto.images.map((image) =>
            this.objectStorageService.uploadFile(image),
          ),
        );
      }

      const categories_connection = [];

      if (createProductDto.categories) {
        for (const category of createProductDto.categories) {
          const categoryObj = await this.categoriesService.getCategoryByName(
            category,
          );

          if (categoryObj) {
            categories_connection.push(categoryObj.id);
          }
        }
      }

      return await this.prisma.product.create({
        data: {
          user: {
            connect: {
              user_id: user.user_id,
            },
          },
          name: createProductDto.name,
          description: createProductDto.description,
          price: +createProductDto.price,
          tags: createProductDto.tags,
          cover_image: {
            create: {
              image: cover_img_url,
            },
          },
          categories: {
            connect: categories_connection,
          },
          images: {
            create: images_url.map((url) => ({
              image: url,
            })),
          },
        },
        include: {
          categories: true,
          images: true,
          user: true,
          cover_image: true,
        },
      });
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<ProductWithRelations> {
    const product = await this.getProductById(id);
    const isUpdatingCoverImage = updateProductDto.cover_image;
    const isUpdatingImages = updateProductDto.images;
    const previusCoverImage = product.cover_image;
    const previousImages = product.images;
    let updatedCoverImage = null;
    let updatedImages = null;

    if (user.user_id !== product.user.user_id) {
      throw new ForbiddenException(
        'No tienes permisos para editar este producto',
      );
    }

    if (isUpdatingCoverImage) {
      this.productImageService.deleteProductImage(previusCoverImage.id);
      updatedCoverImage = await this.objectStorageService.uploadFile(
        updateProductDto.cover_image,
      );
    }

    if (isUpdatingImages) {
      for (const image of previousImages) {
        this.productImageService.deleteProductImage(image.id);
      }
      updatedImages = await Promise.all(
        updateProductDto.images.map((image) =>
          this.objectStorageService.uploadFile(image),
        ),
      );
    }

    const categories_connection = [];

    if (updateProductDto.categories) {
      for (const category of updateProductDto.categories) {
        const categoryObj = await this.categoriesService.getCategoryByName(
          category,
        );

        if (categoryObj) {
          categories_connection.push(categoryObj.id);
        }
      }
    }

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        tags: updateProductDto.tags,
        categories: updateProductDto.categories
          ? {
              connect: categories_connection,
            }
          : undefined,
        price: updateProductDto.price ? +updateProductDto.price : undefined,
        images: updateProductDto.images
          ? {
              create: updatedImages.map((image) => ({
                image,
              })),
            }
          : undefined,
        cover_image: updateProductDto.cover_image
          ? {
              create: {
                image: updatedCoverImage,
              },
            }
          : undefined,
      },
      include: {
        cover_image: true,
        images: true,
        categories: true,
        user: true,
      },
    });
  }

  async deleteProduct(id: number, user: User): Promise<Product> {
    // Delete images first
    const product = await this.getProductById(id);

    if (user.user_id !== product.user.user_id) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este producto',
      );
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const coverImage = product.cover_image;
    const images = product.images;

    if (coverImage) {
      await this.objectStorageService.deleteFileByUrl(coverImage.image);
    }

    for (const image of images) {
      await this.objectStorageService.deleteFileByUrl(image.image);
    }

    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
