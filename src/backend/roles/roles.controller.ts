import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleCreateDto } from './dto/role.create.dto';  
import { RoleUpdateDto } from './dto/role.update.dto';
import { BaseResponse } from '../common/response/base.response';
import { JwtAuthGuard } from '../../backend/auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('list-role')
  async findAll() {
    try {
      const role = await this.rolesService.findAll();
      return BaseResponse.success('Roles fetched successfully', role);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Get(':id')
  @Permissions('show-role')
  async findOne(@Param('id') id: number) {
    try {
      const role = await this.rolesService.findOne(id);
      return BaseResponse.success('Role fetched successfully', role);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Post()
  @Permissions('create-role')
  async create(@Body() body: RoleCreateDto) {
    try {
      const created = await this.rolesService.create(body.name, body.organizationId, body.permissionNames);
      return BaseResponse.success('Role created successfully', created);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Put(':id')
  @Permissions('update-role')
  async update(@Param('id') id: number, @Body() body: RoleUpdateDto) {
    try {
      const updated = await this.rolesService.update(id, body.name, body.permissionNames);
      return BaseResponse.success('Role updated successfully', updated);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Delete(':id')
  @Permissions('delete-role')
  async delete(@Param('id') id: number) {
    try {
      await this.rolesService.delete(id);
      return BaseResponse.success('Role deleted successfully');
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }
}
