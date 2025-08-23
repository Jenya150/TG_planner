import { Context, Telegraf } from 'telegraf';
import { Action, Ctx, Hears, InjectBot, On, Update } from 'nestjs-telegraf';
import { steps, TGTasksService } from './TG.tasks.service';
import { Controller } from '@nestjs/common';
import { AddTask, MyContext, Task } from 'src/interfaces';
import {
  AddTaskMessages,
  DeleteTaskMessages,
  ListOfTaskMessages,
  MenuButtonsTitle,
  TaskDescriptionMessages,
  TaskParamMessage,
  UpdateTaskMessages,
} from '../messages';
import {
  listOfTasksButtons,
  priorityButtons,
  updateButtons,
} from './tasks.buttons';

import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

import * as dotenv from 'dotenv';
import * as process from 'node:process';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const dayjs = require('dayjs');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const customParseFormat = require('dayjs/plugin/customParseFormat');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
dayjs.extend(customParseFormat);

dotenv.config();

@Controller()
@Update()
export class TGTasksController {
  constructor(
    private readonly TGTasksService: TGTasksService,
    @InjectBot() readonly bot: Telegraf,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async check_deadline() {
    const user = await axios.get('http://localhost:3002/users/username/lmk_43');
    if (!user) {
      return;
    }
    const DeadlineTasks = await axios.get(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      'http://localhost:3002/tasks/tasksDeadlineCheck/' + user.data?._id,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = this.TGTasksService.deadlineCheck(DeadlineTasks.data);
    if (!result) {
      return;
    }
    await this.bot.telegram.sendMessage(String(process.env.CHAT_ID), result);
  }

  @Hears(MenuButtonsTitle.list)
  async list_of_tasks(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) {
      return ListOfTaskMessages.noTask;
    }
    const userData = await axios.get(
      'http://localhost:3002/users/username/' + user.username,
    );
    const tasks = await axios.get(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      'http://localhost:3002/tasks/getTasksById/' + userData.data._id,
    );
    if (!userData || tasks.data == 'Tasks not found') {
      return ListOfTaskMessages.noTask;
    }
    await ctx.reply(
      TaskDescriptionMessages.menu,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      await listOfTasksButtons(userData.data._id, 'List'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await this.TGTasksService.listOfTask(String(userData.data._id));
  }

  @Hears(MenuButtonsTitle.create)
  async create_task(@Ctx() ctx: MyContext) {
    ctx.session ??= {
      step: '',
      taskTitle: '',
      taskNotes: '',
      taskPriority: 1,
      taskDeadline: new Date(),
      taskNotified: false,
      update: '',
      idTaskUpdate: '',
    };
    ctx.session.step = 'title';
    await ctx.reply(steps.title.message);
  }

  @Hears(MenuButtonsTitle.update)
  async update_task(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) {
      return UpdateTaskMessages.noTask;
    }
    const userData = await axios.get(
      'http://localhost:3002/users/username/' + user.username,
    );
    const tasks = await axios.get(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      'http://localhost:3002/tasks/getTasksById/' + userData.data._id,
    );
    if (!userData || tasks.data == 'Tasks not found') {
      return UpdateTaskMessages.noTask;
    }
    await ctx.reply(
      TaskDescriptionMessages.menu,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      await listOfTasksButtons(userData.data._id, 'Update'),
    );
  }

  @Hears(MenuButtonsTitle.delete)
  async delete_task(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user?.username) {
      return DeleteTaskMessages.noTask;
    }
    const userdata = await axios.get(
      'http://localhost:3002/users/username/' + user.username,
    );
    const tasks = await axios.get(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      'http://localhost:3002/tasks/getTasksById/' + userdata.data._id,
    );
    if (tasks.data == 'Tasks not found') {
      return DeleteTaskMessages.noTask;
    }
    await ctx.reply(
      DeleteTaskMessages.select,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      await listOfTasksButtons(userdata.data._id, 'Delete'),
    );
  }

  @Action(/^ListButtonSelect_(.+)$/) async listOfTask(@Ctx() ctx: Context) {
    if (typeof ctx.callbackQuery == 'object' && 'data' in ctx.callbackQuery) {
      const IdOfTask = ctx.callbackQuery.data.split('_')[1];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res: Task = await this.TGTasksService.infoAboutOneTask(IdOfTask);
      //console.log(typeof aboutTask(ctx, 'TasksAction', res));
      const [string, buttons] = this.TGTasksService.aboutTaskMessage(
        ctx,
        'TasksAction',
        res,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await ctx.reply(string, buttons);
    } else {
      await ctx.reply(ListOfTaskMessages.error);
    }
  }

  @Action(/^TasksActionButtonSelect_(.+)$/) async taskAction(
    @Ctx() ctx: Context,
  ) {
    if (typeof ctx.callbackQuery == 'object' && 'data' in ctx.callbackQuery) {
      const ActionTask = ctx.callbackQuery.data.split('_')[1];
      if (ActionTask == 'Back') {
        await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      }
      if (ActionTask == 'Done') {
        const TaskId = ctx.callbackQuery.data.split('_')[2];
        //const TaskTitle = ctx.callbackQuery.data.split('_')[3];
        const updateTask = {
          $set: {
            isDone: true,
          },
        };
        await this.TGTasksService.updateTask(TaskId, updateTask);
        await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
        await ctx.reply(TaskParamMessage.doneTask);
      }
      if (ActionTask == 'Cancel') {
        const TaskId = ctx.callbackQuery.data.split('_')[2];
        const updateTask = {
          $set: {
            isDone: false,
          },
        };
        await this.TGTasksService.updateTask(TaskId, updateTask);
        await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
        await ctx.reply(TaskParamMessage.cancelTask);
      }
    }
  }

  @Action(/^UpdateButtonSelect_(.+)$/) async updateTask(@Ctx() ctx: Context) {
    if (typeof ctx.callbackQuery == 'object' && 'data' in ctx.callbackQuery) {
      const IdOfTask = ctx.callbackQuery.data.split('_')[1];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res: Task = await this.TGTasksService.infoAboutOneTask(IdOfTask);
      //console.log(typeof aboutTask(ctx, 'TasksAction', res));
      const [message] = this.TGTasksService.aboutTaskMessage(
        ctx,
        'TasksAction',
        res,
      );
      if (typeof message == 'string') {
        await ctx.reply(message, updateButtons(IdOfTask, 'UpdateAction'));
      }
    } else {
      await ctx.reply(UpdateTaskMessages.error);
    }
  }

  @Action(/^UpdateActionButtonSelect_(.+)$/) async updateTaskSelect(
    @Ctx() ctx: MyContext,
  ) {
    if (typeof ctx.callbackQuery == 'object' && 'data' in ctx.callbackQuery) {
      const ActionTask: string = ctx.callbackQuery.data.split('_')[1];
      const IdOfTask: string = ctx.callbackQuery.data.split('_')[2];
      ctx.session ??= {
        step: '',
        taskTitle: '',
        taskNotes: '',
        taskPriority: 1,
        taskDeadline: new Date(),
        taskNotified: false,
        update: '',
        idTaskUpdate: '',
      };
      ctx.session.idTaskUpdate = IdOfTask;
      if (
        ctx.session.step !== 'doneUpdateTitle' &&
        ctx.session.step !== 'doneUpdateNotes' &&
        ctx.session.step !== 'doneUpdatePriority' &&
        ctx.session.step !== 'doneUpdateDeadline'
      ) {
        ctx.session.step = ActionTask + 'Update';
        if (ctx.session.step == 'priorityUpdate') {
          await ctx.reply(
            UpdateTaskMessages.priority + ': ',
            priorityButtons(),
          );
        } else {
          await ctx.reply(UpdateTaskMessages[ActionTask.toLowerCase()] + ': ');
        }
      }
    }
  }

  @Action(/^DeleteButtonSelect_(.+)$/) async deleteTask(@Ctx() ctx: Context) {
    if (typeof ctx.callbackQuery == 'object' && 'data' in ctx.callbackQuery) {
      const IdOfTask = ctx.callbackQuery.data.split('_')[1];
      //const TitleOfTask = ctx.callbackQuery.data.split('_')[2];
      await ctx.reply(DeleteTaskMessages.done);
      await this.TGTasksService.deleteTask(IdOfTask);
    } else {
      await ctx.reply(DeleteTaskMessages.error);
    }
  }

  @On('text')
  @On('callback_query')
  async onTextAddUpdate(@Ctx() ctx: MyContext) {
    const step = (ctx.session?.step as keyof typeof steps) || 'title';
    const config: AddTask = steps[step];

    if (config) {
      if (ctx.session?.step) {
        if (ctx.session.step == 'title' || ctx.session.step == 'notes') {
          if (steps[ctx.session.step]?.message) {
            config.save(ctx, ctx.text);
            ctx.session.step = config.next;
          }
          if (ctx.session.step == 'priority') {
            await ctx.reply(
              String(steps[ctx.session.step]?.message),
              priorityButtons(),
            );
          } else if (ctx.session.step !== 'done') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await ctx.reply(String(steps[ctx.session.step]?.message));
          }
        } else if (
          ctx.session.step === 'priority' ||
          ctx.session.step === 'priorityUpdate'
        ) {
          if (
            typeof ctx.callbackQuery == 'object' &&
            'data' in ctx.callbackQuery
          ) {
            if (ctx.callbackQuery.data.split('_')[1] == '1') {
              await ctx.reply(TaskParamMessage.prioritySmall);
            } else if (ctx.callbackQuery.data.split('_')[1] == '2') {
              await ctx.reply(TaskParamMessage.priorityMedium);
            } else if (ctx.callbackQuery.data.split('_')[1] == '3') {
              await ctx.reply(TaskParamMessage.priorityHigh);
            }
            config.save(ctx, ctx.callbackQuery.data.split('_')[1]);
          }
          ctx.session.step = config.next;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (steps[ctx.session.step]?.message || ctx.session.step === 'done') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
            await ctx.reply(steps[ctx.session.step]?.message);
          }
        } else if (ctx.session.step === 'deadline') {
          const result = this.TGTasksService.deadlineSave(String(ctx.text));
          if (
            result == AddTaskMessages.deadlineError ||
            result == AddTaskMessages.error
          ) {
            ctx.session.step = '';
            return result;
          }
          config.save(ctx, new Date(String(result)));
          ctx.session.step = config.next;
        }
        if (ctx.session?.step == 'done') {
          const mes = ctx.from;
          const userName: string = mes?.username || 'noUserName';
          await ctx.reply(AddTaskMessages.done);
          await this.TGTasksService.createTask(userName, {
            taskTitle: ctx.session.taskTitle,
            taskNotes: ctx.session.taskNotes,
            taskPriority: ctx.session.taskPriority,
            taskDeadline: new Date(ctx.session.taskDeadline),
            taskNotified: false,
          });
        }

        if (
          ctx.session?.step == 'titleUpdate' ||
          ctx.session?.step == 'notesUpdate'
        ) {
          await config.save(ctx, ctx.text);
          ctx.session.step = config.next;
        } else if (ctx.session.step === 'deadlineUpdate') {
          const result = this.TGTasksService.deadlineSave(String(ctx.text));
          if (
            result == UpdateTaskMessages.deadlineError ||
            result == UpdateTaskMessages.error
          ) {
            ctx.session.step = '';
            return result;
          }
          config.save(ctx, new Date(String(result)));
          ctx.session.step = config.next;
        }

        if (ctx.session?.step.startsWith('doneUpdate')) {
          const item = ctx.session.step.split('Update')[1];
          const updateTask = {
            $set: {
              [item.toLowerCase()]: ctx.session.update,
            },
          };
          await ctx.reply(UpdateTaskMessages.done);
          await this.TGTasksService.updateTask(
            ctx.session.idTaskUpdate,
            updateTask,
          );
          ctx.session.step = '';
        }
      }
    }
  }
}
