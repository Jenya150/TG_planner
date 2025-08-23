import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { actionTaskButtons } from '../tasks/tasks.buttons';
import { GreetingMessage } from '../messages';

@Injectable()
export class TGMenuService {
  static async startCmd(ctx: Context) {
    await ctx.reply(GreetingMessage.first_message, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    await ctx.reply(GreetingMessage.start, actionTaskButtons());
  }
}
