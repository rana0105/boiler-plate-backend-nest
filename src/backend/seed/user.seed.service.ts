import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import { Organization } from '../organizations/organization.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
  ) {}

  async seed() {
    let organization = await this.orgRepo.findOneBy({ name: 'Adiba Tech Solution' });
    if (!organization) {
      organization = this.orgRepo.create({
        name: 'Adiba Tech Solution',
        email: 'adiba@adiba.com',
        phone: '01234567890',
        address: 'Dhaka, Bangladesh',
      });
      await this.orgRepo.save(organization);
    }

    const permissionsPath = path.join(__dirname, '..', '..', 'database', 'seed-data', 'permissions.json');
    const permissionNames: string[] = JSON.parse(fs.readFileSync(permissionsPath, 'utf-8'));

    const permissions: Permission[] = [];
    for (const name of permissionNames) {
      let permission = await this.permissionRepo.findOne({
        where: { name, organization: { id: organization.id } },
        relations: ['organization'],
      });
      if (!permission) {
        permission = this.permissionRepo.create({ name, organization });
        await this.permissionRepo.save(permission);
      }
      permissions.push(permission);
    }

    let adminRole = await this.roleRepo.findOne({
      where: { name: 'super-admin', organization: { id: organization.id } },
      relations: ['permissions', 'organization'],
    });

    if (!adminRole) {
      adminRole = this.roleRepo.create({ name: 'super-admin', permissions, organization });
      await this.roleRepo.save(adminRole);
    }

    const email = 'super@admin.com';
    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const adminUser = this.userRepo.create({
        email,
        password: hashedPassword,
        roles: [adminRole],
        organization,
      });
      await this.userRepo.save(adminUser);
    }

    console.log('✅ User seed completed');
  }
}
