import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  async seed() {
    const readUser = await this.permissionRepo.save({ name: 'read_user' });
    const writeUser = await this.permissionRepo.save({ name: 'write_user' });
    const updateUser = await this.permissionRepo.save({ name: 'update_user' });
    const deleteUser = await this.permissionRepo.save({ name: 'delete_user' });

    const adminRole = await this.roleRepo.save({
      name: 'admin',
      permissions: [readUser, writeUser, updateUser, deleteUser],
    });

    const hashedPassword = await bcrypt.hash('12345678', 10);

    await this.userRepo.save({
      email: 'admin@admin.com',
      password: hashedPassword,
      roles: [adminRole],
    });

    console.log('✅ User seed completed');
  }
}
