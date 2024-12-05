import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseFilters,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GeneralExceptionFilter } from 'src/filters/exceptions/general-exception/general-exception.filter';

@Controller('users')
// @UseFilters(new GeneralExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.usersService.findOne(+user_id);
  }

  @Patch(':user_id')
  update(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+user_id, updateUserDto);
  }

  @Delete(':user_id')
  @HttpCode(204)
  remove(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.usersService.remove(+user_id);
  }
}
