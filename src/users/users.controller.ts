import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Delete,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@ApiTags('usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @Get('/profile/:user_id')
  @ApiOperation({
    summary: 'Obtener el perfil de un usuario',
    description: 'Obtener el perfil de un usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  getProfile(@Param('user_id') user_id: number) {
    return this.usersService.getProfile(+user_id);
  }
}
