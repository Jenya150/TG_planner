## TG-planner
TG-planner is a Telegram bot for managing personal tasks with full CRUD functionality. The project is built with NestJS, follows a solid architectural structure, and uses MongoDB as the database.
The bot allows users to create, read, update, and delete tasks directly from Telegram. Additionally, it features a notification system that sends a warning one hour before a task’s deadline.


## Features
 - Full CRUD operations for tasks via Telegram
 - Structured NestJS architecture
 - MongoDB integration
 - Deadline notifications (1 hour before due)
 - Clean and maintainable codebase

## Technologies & Libraries
 - [NestJS](https://nestjs.com)
 - [MongoDB](https://www.mongodb.com)
 - [mongoose](https://mongoosejs.com)
 - [Telegraf](https://telegraf.js.org/index.html)
 - [Day.js](https://day.js.org) + [customParseFormat plugin](https://day.js.org/docs/en/plugin/custom-parse-format)
 - [Axios](https://axios-http.com)
 - [dotenv](https://www.npmjs.com/package/dotenv)

## Installation & Setup
1. Clone the repository:
```bash
$ git clone https://github.com/Jenya150/tg-planner.git
```

2. Install dependencies:
```bash
$ npm install
```

3. Create a .env file with your configuration.
Create a ```.env``` file in the root of your project 
```bash
# telegram

BOT_TOKEN=""
CHAT_ID=""

#mongoDB

URI="" #URI mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>/?retryWrites=true&w=majority&appName=<APP_NAME> 
```

4. Start the bot:
```bash
$ npm run start
```

## Usage
Interact with the bot in Telegram to manage your tasks.
Create a task
Update a task
Delete a task
Receive reminders before deadlines

## Contacts 
If you have questions or suggestions, feel free to reach out:

Telegram: [@lmk_43](https://t.me/lmk_43)

GitHub: [Jenya150](https://github.com/Jenya150)


Enjoy using tg-planner and stay productive! 🚀

