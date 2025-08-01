import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/organization.update.dto';
import { BaseResponse } from '../common/response/base.response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @Permissions('create-organization')
  async create(@Body() dto: CreateOrganizationDto) {
    try {
      const org = await this.orgService.create(dto);
      return BaseResponse.success('Organization created successfully', org);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Get()
  @Permissions('list-organization')
  async findAll() {
    try {
      const orgs = await this.orgService.findAll();
      return BaseResponse.success('Organizations fetched successfully', orgs);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Get(':id')
  @Permissions('show-organization')
  async findOne(@Param('id') id: string) {
    try {
      const org = await this.orgService.findOne(+id);
      return BaseResponse.success('Organization fetched successfully', org);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Put(':id')
  @Permissions('update-organization')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    try {
      const updated = await this.orgService.update(+id, dto);
      return BaseResponse.success('Organization updated successfully', updated);
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }

  @Delete(':id')
  @Permissions('delete-organization')
  async delete(@Param('id') id: string) {
    try {
      await this.orgService.delete(+id);
      return BaseResponse.success('Organization deleted successfully');
    } catch (err) {
      return BaseResponse.fromException(err);
    }
  }
}
