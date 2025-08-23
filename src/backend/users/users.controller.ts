import { Controller, Get, Post, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':userName')
  create(@Param('userName') userName: string) {
    return this.usersService.create(userName);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/id/:id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get('/username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Get('/usernameExist/:username')
  doesUserExist(@Param('username') username: string) {
    return this.usersService.doesUserExist(username);
  }

  @Put(':id')
  TaskPlusOne(@Param('id') id: string) {
    return this.usersService.TaskCountAdded(id);
  }

  @Delete('/username/:username')
  removeByUsername(@Param('username') username: string) {
    return this.usersService.removeByUsername(username);
  }

  @Delete('/id/:id')
  removeById(@Param('id') id: string) {
    return this.usersService.removeById(id);
  }

  @Delete()
  deleteAll() {
    return this.usersService.removeAll();
  }
}
