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
import { FilterProductsDto } from './dto/filter-products.dto';
import { LikesService } from 'src/likes/likes.service';

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
    private readonly likesService: LikesService,
  ) {}

  async getProductById(
    id: number,
    user_id?: number,
  ): Promise<ProductWithRelations & { isLiked: boolean }> {
    let isLiked = false;

    if (user_id) {
      isLiked = await this.likesService.getIsProductLiked(user_id, id);
    }

    const product = await this.prisma.product.findUnique({
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

    return {
      ...product,
      isLiked,
    };
  }

  async getAllProduct(
    filterProductsDto: FilterProductsDto,
  ): Promise<ProductWithRelations[]> {
    try {
      return await this.prisma.product.findMany({
        include: {
          categories: true,
          images: true,
          cover_image: true,
          user: true,
        },
        take: filterProductsDto.limit,
        skip: filterProductsDto.offset,
        where: {
          name: {
            contains: filterProductsDto.q,
            mode: 'insensitive',
          },
          user: {
            user_id: filterProductsDto.user_id,
          },
          isActive: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return [];
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

  async deactivateProduct(id: number) {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      include: {
        cover_image: true,
        images: true,
        categories: true,
        user: true,
      },
    });
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ): Promise<ProductWithRelations> {
    const product = await this.getProductById(id);
    const isUpdatingCoverImage = updateProductDto.cover_image;
    const isUpdatingImages = updateProductDto.images;
    const previusCoverImage = product.cover_image;
    const previousImages = product.images;
    let updatedCoverImage = null;
    let updatedImages = null;

    if (userId !== product.user.user_id) {
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
        name: updateProductDto.name ?? product.name,
        description: updateProductDto.description ?? product.description,
        tags: updateProductDto.tags ?? product.tags,
        categories: updateProductDto.categories
          ? {
              connect: categories_connection,
            }
          : {
              connect: product.categories,
            },
        price: updateProductDto.price ? +updateProductDto.price : product.price,
        images: updateProductDto.images
          ? {
              create: updatedImages.map((image) => ({
                image,
              })),
            }
          : {
              connect: product.images,
            },
        cover_image: updateProductDto.cover_image
          ? {
              create: {
                image: updatedCoverImage,
              },
            }
          : {
              connect: product.cover_image,
            },
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
    const product = await this.getProductById(id);

    if (user.user_id !== product.user.user_id) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este producto',
      );
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete images first
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
