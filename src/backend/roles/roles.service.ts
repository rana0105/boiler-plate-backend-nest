import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) {}
    
    async findAll() {
        return this.roleRepository.find();
    }

    async findOne(id: number) {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) throw new Error(`Role with id ${id} not found`);
        return role;
    }

    async create(name: string) {
        const role = this.roleRepository.create({ name });
        return this.roleRepository.save(role);
    }

    async update(id: number, name: string) {
        const role = await this.findOne(id);
        role.name = name;
        return this.roleRepository.save(role);
    }
    
    async delete(id: number) {
        const role = await this.findOne(id);
        return this.roleRepository.remove(role);
    }
}
