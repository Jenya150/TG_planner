import { Module } from '@nestjs/common';
import { TGMenuController } from './TG.menu.controller';
import { TGMenuService } from './TG.menu.service';

@Module({
  imports: [],
  providers: [TGMenuService],
  controllers: [TGMenuController],
})
export class TGMenuModule {}
