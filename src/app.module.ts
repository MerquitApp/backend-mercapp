import { WarehouseModule } from './warehouse/warehouse.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [WarehouseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
