import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    ) {}
    
    async findAll() {
        return this.permissionRepository.find();
    }

    async findOne(id: number) {
        const permission  = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) throw new Error(`Permission with id ${id} not found`);
        return permission;

    }

    async create(name: string) {
        const permission = this.permissionRepository.create({ name });
        return this.permissionRepository.save(permission);
    }

    async update(id: number, name: string) {
        const permission = await this.findOne(id);
        permission.name = name;
        return this.permissionRepository.save(permission);
    }
    
    async delete(id: number) {
        const permission = await this.findOne(id);
        return this.permissionRepository.remove(permission);
    }
}
