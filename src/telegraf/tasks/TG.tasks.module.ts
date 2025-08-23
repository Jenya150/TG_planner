import { Module } from '@nestjs/common';
import { TGTasksService } from './TG.tasks.service';

@Module({
  providers: [TGTasksService],
  exports: [TGTasksService],
})
export class TGTasksModule {}
