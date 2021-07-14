import { Injectable } from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';

@Injectable()
export class TodosService {

      todos: object[] = [];  

      deletedTodos: object[] = [];

      create(todo: TodoDto): void {
          this.todos.push({
          description: todo.description,
          completed: false
        });
      }

      getAll(){
        return this.todos.map((el, index) => ({ id: index, ...el }) );
      }

      getDeleted(){
        return this.deletedTodos;
      }

      update(id: number, todo: TodoDto){
        if (id < 0) {return "Некоректні дані"}
        this.todos[id] = {...todo};
        return this.todos;
      }
    
      delete(id: number) {
        if (id < 0) {return "Некоректні дані"}
        const deleted = this.todos.splice(id, 1);
        deleted.forEach(el => this.deletedTodos.push(el));
        return this.todos;
      }
}
