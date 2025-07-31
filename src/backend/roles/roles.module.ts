import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
  imports: [TypeOrmModule.forFeature([Role, Permission])],
})
export class RolesModule {}
