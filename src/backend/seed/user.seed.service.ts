import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  async seed() {
    const permissionsPath = path.join(__dirname, '..', '..', 'database', 'seed-data', 'permissions.json');
    const permissionNames: string[] = JSON.parse(fs.readFileSync(permissionsPath, 'utf-8'));

    const permissions: Permission[] = [];
    for (const name of permissionNames) {
      let permission = await this.permissionRepo.findOneBy({ name });
      if (!permission) {
        permission = this.permissionRepo.create({ name });
        await this.permissionRepo.save(permission);
      }
      permissions.push(permission);
    }

    let adminRole = await this.roleRepo.findOne({
      where: { name: 'admin' },
      relations: ['permissions'],
    });

    if (!adminRole) {
      adminRole = this.roleRepo.create({ name: 'admin', permissions });
      await this.roleRepo.save(adminRole);
    }

    const email = 'admin@admin.com';
    const existingUser = await this.userRepo.findOneBy({ email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const adminUser = this.userRepo.create({
        email,
        password: hashedPassword,
        roles: [adminRole],
      });
      await this.userRepo.save(adminUser);
    }

    console.log('✅ User seed completed');
  }
}
