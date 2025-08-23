import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/tasksDeadlineCheck/:usernameId') async getTasksDeadlineCheck(
    @Param('usernameId') usernameId: string,
  ) {
    const tasks = await this.tasksService.deadlineCheck(usernameId);
    if (tasks) {
      const tasksTitle: string[] = [];
      for (const task of tasks) {
        tasksTitle.push(task.title);
        await this.tasksService.update(String(task._id), {
          $set: { notified: true },
        });
      }
      return tasksTitle;
    }
    return null;
  }

  @Post('/userName/:userName') async create(
    @Param('userName') userName: string,
    @Body()
    session: {
      taskTitle: string;
      taskNotes: string;
      taskPriority: number;
      taskDeadline: any;
      taskNotified: boolean;
    },
  ) {
    await this.tasksService.create(
      userName,
      session.taskTitle,
      session.taskNotes,
      session.taskPriority,
      session.taskDeadline,
      session.taskNotified,
    );
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Get('/getTasksById/:id') async findTasksById(@Param('id') id: string) {
    return this.tasksService.findByUserId(id);
  }

  @Put('/updateTasksById/:id') async update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    await this.tasksService.update(id, body);
  }

  @Delete('/id/:id')
  async removeById(@Param('id') id: string) {
    await this.tasksService.removeById(id);
  }

  @Delete()
  async deleteAll() {
    await this.tasksService.removeAll();
  }
}
