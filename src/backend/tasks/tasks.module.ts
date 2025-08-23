import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './tasks.entity';
import { TasksController } from './tasks.controller';
import { userSchema } from '../users/users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'tasks', schema: taskSchema },
      { name: 'users', schema: userSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
