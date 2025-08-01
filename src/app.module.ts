import * as dotenv from 'dotenv';
dotenv.config();

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './backend/auth/auth.module';
import { UsersModule } from './backend/users/users.module';
import { OrganizationsModule } from './backend/organizations/organization.module';
import { RolesModule } from './backend/roles/roles.module';
import { PermissionsModule } from './backend/permissions/permissions.module';
import { SeedModule } from './backend/seed/seed.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationMiddleware } from './backend/common/middleware/organization.middleware';

const isDev = process.env.NODE_ENV === 'development';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: isDev,
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    RolesModule,
    PermissionsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OrganizationMiddleware)
      .forRoutes('*');
  }
}
