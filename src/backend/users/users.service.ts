import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async create(
    email: string,
    password: string,
    name: string,
    roleNames: string[] = ['user'], // default role
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roles = await this.roleRepository.findBy({ name: In(roleNames) });
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      roles,
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
    },
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateData.email) user.email = updateData.email;
    if (updateData.name) user.name = updateData.name;
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.roleNames) {
      const roles = await this.roleRepository.findBy({
        name: In(updateData.roleNames),
      });
      user.roles = roles;
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
} 