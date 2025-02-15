import { Injectable } from '@nestjs/common';
import { ObjectStorageService } from 'src/object-storage/object-storage.service';
import { PrismaService } from 'src/common/db/prisma.service';

@Injectable()
export class ProductImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  async getProductImageById(id: number): Promise<any> {
    return this.prisma.productImage.findUnique({
      where: {
        id,
      },
    });
  }

  async createProductImage(data: any): Promise<any> {
    return this.prisma.productImage.create({
      data,
    });
  }

  async updateProductImage(id: number, data: any): Promise<any> {
    return this.prisma.productImage.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteProductImage(id: number): Promise<any> {
    const image = await this.getProductImageById(id);
    await this.objectStorageService.deleteFileByUrl(image.image);
    return this.prisma.productImage.delete({
      where: {
        id,
      },
    });
  }
}
