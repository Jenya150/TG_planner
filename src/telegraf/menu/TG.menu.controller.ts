import { Controller } from '@nestjs/common';
import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TGMenuService } from './TG.menu.service';

@Controller()
@Update()
export class TGMenuController {
  @Start()
  async greetings(@Ctx() ctx: Context) {
    return TGMenuService.startCmd(ctx);
  }
}
