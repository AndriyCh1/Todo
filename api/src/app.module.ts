import { Module } from '@nestjs/common';
import { TodosModule} from './todo/todo.module';

@Module({
  imports: [TodosModule]
})
export class AppModule {}
