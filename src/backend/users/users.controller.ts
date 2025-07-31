import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../backend/auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { UserCreateDto } from './dto/user.creare.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { BaseResponse } from '../common/response/base.response';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('list-user')
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return BaseResponse.success('User list fetched successfully', users);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Post()
  @Permissions('create-user')
  async create(@Body() body: UserCreateDto) {
    try {
      const user = await this.usersService.create(body.email, body.password, body.name, body.roleNames, body.permissionNames);
      return BaseResponse.success('User created successfully', user);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Get(':id')
  @Permissions('show-user')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(Number(id));
      return BaseResponse.success('User fetched successfully', user);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Put(':id')
  @Permissions('update-user')
  async update(@Param('id') id: string, @Body() body: UserUpdateDto) {
    try {
      const updated = await this.usersService.update(Number(id), body);
      if (!updated) throw new NotFoundException('User not found for update');
      return BaseResponse.success('User updated successfully', updated);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Delete(':id')
  @Permissions('delete-user')
  async delete(@Param('id') id: string) {
    try {
      await this.usersService.delete(Number(id));
      return BaseResponse.success('User deleted successfully');
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }
}
