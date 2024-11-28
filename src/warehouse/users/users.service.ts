import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  // Agregado 28/11/2024 por Andy
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  // Agregado 28/11/2024 por Andy
  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['user_id', 'name', 'email', 'password', 'role'],
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
    throw new HttpException(
      'Error updating user.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  remove(id: number) {
    // return `This action removes a #${id} user`;
    throw new Error('Method not implemented.');
  }
}
