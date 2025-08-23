import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { TGTasksService } from './telegraf/tasks/TG.tasks.service';
import { TGTasksController } from './telegraf/tasks/TG.tasks.controller';
import { TasksModule } from './backend/tasks/tasks.module';
import { TGMenuModule } from './telegraf/menu/TG.menu.module';
import { TGTasksModule } from './telegraf/tasks/TG.tasks.module';
import { TGMenuController } from './telegraf/menu/TG.menu.controller';
import { TGMenuService } from './telegraf/menu/TG.menu.service';
import { UsersModule } from './backend/users/users.module';
import { session } from 'telegraf';
import { ScheduleModule } from '@nestjs/schedule';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(String(process.env.URI)),
    TelegrafModule.forRoot({
      middlewares: [session()],
      token: String(process.env.BOT_TOKEN),
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    UsersModule,
    TGMenuModule,
    TGTasksModule,
  ],
  providers: [
    TGMenuController,
    TGMenuService,
    TGTasksController,
    TGTasksService,
  ],
  controllers: [TGMenuController],
})
export class AppModule {}
