import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './user/user.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
