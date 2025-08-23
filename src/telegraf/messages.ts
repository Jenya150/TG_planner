export const GreetingMessage = {
  first_message: 'Hello 👋',
  start:
    'I’m your assistant for managing tasks!\n' +
    'Here you can create new tasks, edit them, delete them, or view your list.\n' +
    'Choose where we should start ⬇️',
};

export const DeadlineMessage = {
  warningOneTask:
    ' ⏰ — less than 1 hour left until the deadline!  \n' + 'Don’t delay ⚡',
  warningManyTasks: '⏰ Less than 1 hour left — hurry up with: ',
};

export const ListOfTaskMessages = {
  noTask:
    'You don’t have any tasks yet 😌\n' +
    'Add your first one to get started ➕',
  error:
    '⚠️ An error occurred while performing the action.\n' +
    'Please try again or check the correctness of the entered data.',
};

export const AddTaskMessages = {
  title:
    'Let’s create a new task. I’ll ask a few things — just reply with messages.\n' +
    '\n' +
    ' 1️⃣ First, write the task name (short and clear).' +
    ' ✍️ Example: "Prepare a presentation"',
  notes:
    '2️⃣ Now describe the task in a bit more detail — write notes on what exactly needs to be done\n' +
    '📝 Example: "Take notes, highlight key points, summarize ideas"',
  priority: '3️⃣ Rate the priority of this task from 1 to 3, where:',
  deadline:
    '4️⃣ Great! Now enter the deadline in the format\n' +
    'dd.mm.yyyy hh:mm AM/PM ⏰\n' +
    'Example: 17.08.2025 02:30 PM',
  done: 'Added successfully 🎉',
  error:
    '⚠️ An error occurred while performing the action.\n' +
    'Please try again or check the correctness of the entered data.',
  deadlineError:
    '⚠️ Error: The task was not added because the date has already passed.',
};

export const UpdateTaskMessages = {
  title: 'Enter a new task name 📝\n',
  notes: 'Enter a new task description ✨',
  priority: 'Choose a new priority for the task 🔽',
  deadline:
    'Enter a new deadline in the format\n' +
    'dd.mm.yyyy hh:mm AM/PM ⏰\n' +
    'Example: 17.08.2025 02:30 PM',
  select: 'Choose a task from the list below to edit ✏️',
  done: 'Changes saved successfully ✏️✅',
  noTask:
    'There are no tasks to edit 🤔' +
    'Create a new one and then you’ll be able to edit it ✨',
  error:
    '⚠️ An error occurred while performing the action.\n' +
    'Please try again or check the correctness of the entered data.',
  deadlineError:
    '⚠️ Error: The task was not added because the date has already passed.',
};

export const DeleteTaskMessages = {
  select: 'Choose a task to delete 🗑️️',
  done: 'Task deleted successfully ✅\n' + 'Your list is now cleaner ✨',
  noTask: 'The list is currently empty 🌱\n' + 'Nothing to delete 😉',
  error:
    '⚠️ An error occurred while performing the action.\n' +
    'Please try again or check the correctness of the entered data.\n',
};

export const MenuButtonsTitle = {
  list: '📋 List',
  create: '➕ Add',
  update: '✏️ Edit',
  delete: '🗑 Delete',
  // list: 'l',
  // create: 'a',
  // update: 'q',
  // delete: 'e',
};

export const TaskDescriptionMessages = {
  menu:
    '📋 Here’s your task list:' + 'Choose a task to view its description 👇',
  title: '📌 Title: ',
  notes: '📝 Notes: ',
  priority: '🎯 Priority: ',
  deadline: '🕓 Deadline: ',
  isDone: '✅ Is done: ',
};

export const TaskParamMessage = {
  priorityHigh: '🔴 High',
  priorityMedium: '🟡 Medium',
  prioritySmall: '🔵 Low',
  idDoneTrue: '✅ Yes',
  isDoneFalse: '❌ No',
  doneTask: 'Great! Task completed ✅',
  cancelTask: 'Task completion canceled 🔄',
};
