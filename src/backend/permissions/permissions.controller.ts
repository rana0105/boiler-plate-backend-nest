import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards  } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionCreateDto } from './dto/permission.create.dto';
import { PermissionUpdateDto } from './dto/permission.update.dto';
import { BaseResponse } from '../common/response/base.response';
import { JwtAuthGuard } from '../../backend/auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Get()
  @Permissions('list-permission')
  async findAll() {
    try {
      const permissions = await this.permissionsService.findAll();
      return BaseResponse.success('Permissions fetched successfully', permissions);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Get(':id')
  @Permissions('show-permission')
  async findOne(@Param('id') id: number) {
    try {
      const permission = await this.permissionsService.findOne(id);
      return BaseResponse.success('Permission fetched successfully', permission);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Post()
  @Permissions('create-permission')
  async create(@Body() body: PermissionCreateDto) {
    try {
      const created = await this.permissionsService.create(body.name);
      return BaseResponse.success('Permission created successfully', created);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Put(':id')
  @Permissions('update-permission')
  async update(@Param('id') id: number, @Body() body: PermissionUpdateDto) {
    try {
      const updated = await this.permissionsService.update(id, body.name);
      return BaseResponse.success('Permission updated successfully', updated);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Delete(':id')
  @Permissions('delete-permission')
  async delete(@Param('id') id: number) {
    try {
      await this.permissionsService.delete(id);
      return BaseResponse.success('Permission deleted successfully');
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }
}
