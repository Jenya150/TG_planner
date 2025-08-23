import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  AddTaskMessages,
  DeadlineMessage,
  MenuButtonsTitle,
  TaskDescriptionMessages,
  TaskParamMessage,
} from '../messages';
import { Context, Markup } from 'telegraf';
import { Task } from '../../interfaces';
import { taskActionButtons } from './tasks.buttons';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
const dayjs = require('dayjs');

export const steps = {
  title: {
    message: AddTaskMessages.title,
    next: 'notes',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    save: (ctx, value: string): string => (ctx.session.taskTitle = value),
  },
  notes: {
    message: AddTaskMessages.notes,
    next: 'priority',
    save: (ctx, value: string): string =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ctx.session.taskNotes = value),
  },
  priority: {
    message: AddTaskMessages.priority,
    next: 'deadline',
    save: (ctx, value: string): string =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ctx.session.taskPriority = value),
  },
  deadline: {
    message: AddTaskMessages.deadline,
    next: 'done',
    save: (ctx, value: string): string =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ctx.session.taskDeadline = value),
  },

  titleUpdate: {
    message: AddTaskMessages.title,
    next: 'doneUpdateTitle',
    save: (ctx, value: string): string =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ctx.session.update = value),
  },
  notesUpdate: {
    message: AddTaskMessages.notes,
    next: 'doneUpdateNotes',
    save: (ctx, value: string): string =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ctx.session.update = value),
  },
  deadlineUpdate: {
    message: AddTaskMessages.deadline,
    next: 'doneUpdateDeadline',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    save: (ctx, value: string): string => (ctx.session.update = value),
  },
  priorityUpdate: {
    message: AddTaskMessages.priority,
    next: 'doneUpdatePriority',
    save: (ctx, value: string): string =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (ctx.session.update = value),
  },
};

@Injectable()
export class TGTasksService {
  deadlineCheck(tasksArray: string[]) {
    if (tasksArray.length == 0) {
      return;
    } else if (tasksArray.length == 1) {
      return String(DeadlineMessage.warningOneTask + tasksArray[0]);
    } else {
      const DeadlineTasksTitle: string[] = [];
      for (const task of tasksArray) {
        DeadlineTasksTitle.push(String(task));
        if (task !== tasksArray[tasksArray.length - 1]) {
          DeadlineTasksTitle.push(', ');
        }
      }
      return String(
        DeadlineMessage.warningManyTasks + DeadlineTasksTitle.join(''),
      );
    }
  }

  async listOfTask(userId: string) {
    const res = await axios.get(
      'http://localhost:3002/tasks/getTasksById/' + userId,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.data;
  }

  async createTask(
    userName: string,
    session: {
      taskTitle: string;
      taskNotes: string;
      taskPriority: number;
      taskDeadline: Date;
      taskNotified: boolean;
    },
  ) {
    await axios.post(
      'http://localhost:3002/tasks/userName/' + userName,
      session,
    );
  }

  async deleteTask(id: string) {
    await axios.delete('http://localhost:3002/tasks/id/' + id);
  }

  async updateTask(id: string, body: any) {
    await axios.put('http://localhost:3002/tasks/updateTasksById/' + id, body);
  }

  async infoAboutOneTask(id: string) {
    const res = await axios.get('http://localhost:3002/tasks/' + id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.data;
  }

  aboutTaskMessage(ctx: Context, actionTitle: string, res: Task) {
    if (typeof ctx.callbackQuery == 'object' && 'data' in ctx.callbackQuery) {
      let priority = 'Err';
      if (res.priority == 3) {
        priority = TaskParamMessage.priorityHigh;
      } else if (res.priority == 2) {
        priority = TaskParamMessage.priorityMedium;
      } else {
        priority = TaskParamMessage.prioritySmall;
      }
      const istDone = res?.isDone
        ? TaskParamMessage.idDoneTrue
        : TaskParamMessage.isDoneFalse;
      const deadline = String(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        dayjs(res?.deadline).format('DD/MM/YYYY h:mm A'),
      );
      return [
        TaskDescriptionMessages.title +
          res?.title +
          '\n' +
          TaskDescriptionMessages.notes +
          res?.notes +
          '\n' +
          TaskDescriptionMessages.priority +
          priority +
          '\n' +
          TaskDescriptionMessages.deadline +
          deadline +
          '\n' +
          TaskDescriptionMessages.isDone +
          istDone +
          '\n',
        taskActionButtons(
          String(res?._id),
          String(res?.title),
          Boolean(res?.isDone),
          actionTitle,
        ),
      ];
    } else {
      return [
        'No tasks',
        Markup.keyboard([
          Markup.button.callback(MenuButtonsTitle.list, 'list_of_tasks'),
        ]),
      ];
    }
  }

  deadlineSave(deadline: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (deadline && dayjs(deadline, 'D.M.YYYY h:mm A').isValid()) {
      const [datePart, timePart, meridiemPart] = deadline.split(' ');
      // eslint-disable-next-line prefer-const
      let [day, month, year] = datePart.split('.');
      if (day.length < 2) {
        day = '0' + day;
      }
      if (month.length < 2) {
        month = '0' + month;
      }
      let [hour, minute] = timePart.split(':');
      if (meridiemPart == 'PM') {
        hour = String(+hour + 12);
      }
      if (hour.length < 2) {
        hour = '0' + hour;
      }
      if (minute.length < 2) {
        minute = '0' + minute;
      }
      const date = new Date(
        year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00',
      );
      if (date < new Date()) {
        return AddTaskMessages.deadlineError;
      }
      return date;
    } else {
      return AddTaskMessages.error;
    }
  }
}
