import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  // UseFilters,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@ApiTags('usuarios')
@Controller('users')
// @UseFilters(new GeneralExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':user_id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza la información de un usuario a partir de su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  update(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+user_id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':user_id')
  @ApiOperation({
    summary: 'Elimina un usuario',
    description: 'Elimina un usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  deleteUser(@Param('user_id') user_id: string) {
    return this.usersService.remove(+user_id);
  }
}
