import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import { UserSeedService } from './user.seed.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    UsersModule,
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class SeedModule {}
