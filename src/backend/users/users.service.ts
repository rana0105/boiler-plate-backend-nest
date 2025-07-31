import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['roles', 'permissions'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'permissions'],
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async create(
    email: string,
    password: string,
    name: string,
    roleNames: string[] = ['user'],
    permissionNames: string[] = [],
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roles = await this.roleRepository.findBy({ name: In(roleNames) });
    const permissions = await this.permissionRepository.findBy({ name: In(permissionNames) });
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      roles,
      permissions,
    });

    return this.userRepository.save(user);
  }

  async update(
    id: number,
    updateData: {
      email?: string;
      password?: string;
      name?: string;
      roleNames?: string[];
      permissionNames?: string[];
    },
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateData.email) user.email = updateData.email;
    if (updateData.name) user.name = updateData.name;
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.roleNames) {
      user.roles = await this.roleRepository.findBy({ name: In(updateData.roleNames) });
    }
    if (updateData.permissionNames) {
      user.permissions = await this.permissionRepository.findBy({ name: In(updateData.permissionNames) });
    }

    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'permissions'],
    });

    if (!user) throw new NotFoundException('User not found');

    const rolePermissions = user.roles.flatMap((role) => role.permissions.map((p) => p.name));
    const directPermissions = user.permissions.map((p) => p.name);

    return Array.from(new Set([...rolePermissions, ...directPermissions]));
  }
}