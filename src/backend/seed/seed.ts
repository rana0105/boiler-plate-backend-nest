import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UserSeedService } from './user.seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userSeeder = app.get(UserSeedService);

  if (process.env.SEED === 'true') {
    await userSeeder.seed();
    console.log('✅ Seeding complete');
  } else {
    console.log('ℹ️ SEED is not set to true. Skipping seeding.');
  }

  await app.close();
}
bootstrap();
