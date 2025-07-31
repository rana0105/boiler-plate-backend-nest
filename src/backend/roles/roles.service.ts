import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll() {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  async create(name: string, permissionNames: string[] = []) {
    const permissions = await this.permissionRepository.findBy({ name: In(permissionNames) });
    const role = this.roleRepository.create({ name, permissions });
    return this.roleRepository.save(role);
  }

  async update(id: number, name: string, permissionNames: string[] = []) {
    const role = await this.findOne(id);
    role.name = name;
    role.permissions = await this.permissionRepository.findBy({ name: In(permissionNames) });
    return this.roleRepository.save(role);
  }

  async delete(id: number) {
    const role = await this.findOne(id);
    return this.roleRepository.remove(role);
  }
}