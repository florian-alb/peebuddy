import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserService } from './user/user.service';
import { DatabaseModule } from './database/database.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [LinksModule, DatabaseModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
