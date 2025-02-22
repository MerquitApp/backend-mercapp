import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza la información de un usuario a partir de su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user_id = req.user.user_id;
    return this.usersService.update(+user_id, updateUserDto);
  }

  @Delete()
  @ApiOperation({
    summary: 'Elimina un usuario',
    description: 'Elimina un usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  deleteUser(@Req() req) {
    const user_id = req.user.user_id;
    return this.usersService.remove(+user_id);
  }
}
