import { Markup } from 'telegraf';
import axios from 'axios';
import { MenuButtonsTitle, TaskParamMessage } from '../messages';

export function actionTaskButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback(MenuButtonsTitle.list, 'list_of_tasks'),
      Markup.button.callback(MenuButtonsTitle.create, 'create_task'),
      Markup.button.callback(MenuButtonsTitle.update, 'update_task'),
      Markup.button.callback(MenuButtonsTitle.delete, 'delete_task'),
    ],
    {
      columns: 2,
    },
  ).resize();
}

export async function listOfTasksButtons(id: string, functionName: string) {
  const tasks = await axios.get(
    'http://localhost:3002/tasks/getTasksById/' + id,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  const tasks_title = tasks.data.map((task): object => task.title);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
  const tasks_id = tasks.data.map((task): object => task._id);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const merge = tasks_title.map((item: string, index: number) =>
    Markup.button.callback(
      String(item),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      functionName + 'ButtonSelect_' + tasks_id[index] + '_' + item,
    ),
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Markup.inlineKeyboard(merge);
}

export function taskActionButtons(
  id: string,
  title: string,
  isDone: boolean,
  functionName: string,
) {
  const isDoneTitle = !isDone ? 'Done' : 'Cancel';
  return Markup.inlineKeyboard([
    Markup.button.callback(
      isDoneTitle,
      functionName + 'ButtonSelect_' + isDoneTitle + '_' + id + '_' + title,
    ),
    Markup.button.callback('Back', functionName + 'ButtonSelect_' + 'Back'),
  ]);
}

export function priorityButtons() {
  return Markup.inlineKeyboard([
    Markup.button.callback(
      TaskParamMessage.prioritySmall,
      'PriorityButtonSelect_' + '1',
    ),
    Markup.button.callback(
      TaskParamMessage.priorityMedium,
      'PriorityButtonSelect_' + '2',
    ),
    Markup.button.callback(
      TaskParamMessage.priorityHigh,
      'PriorityButtonSelect_' + '3',
    ),
  ]);
}

export function updateButtons(id: string, functionName: string) {
  return Markup.inlineKeyboard([
    Markup.button.callback(
      'title',
      functionName + 'ButtonSelect_' + 'title_' + id,
    ),
    Markup.button.callback(
      'notes',
      functionName + 'ButtonSelect_' + 'notes_' + id,
    ),
    Markup.button.callback(
      'priority',
      functionName + 'ButtonSelect_' + 'priority_' + id,
    ),
    Markup.button.callback(
      'deadline',
      functionName + 'ButtonSelect_' + 'deadline_' + id,
    ),
  ]);
}
