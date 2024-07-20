import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('User')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  /*@Get()
  findAll(): Promise<User[]> {
    return this.UserService.findAll();
  }*/

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.UserService.findOne(id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.UserService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<void> {
    return this.UserService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.UserService.remove(id);
  }
}