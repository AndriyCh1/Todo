import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TodoDto } from '../dto/todo.dto';
import { TodoListDto } from '../dto/todo.dto';

@Injectable()
export class TodosService {

      todos: TodoDto[] = [];  

      create(todo: TodoDto): void {
          this.todos.push({
          description: todo.description,
          completed: false
        });
      }

      getAll(): TodoListDto[]{
        return this.todos.map((el, index) => ({ id: index, ...el }));
      }

      update(id: number, todo: TodoDto): TodoDto[]{
        console.log(id, "--uuuuuuuu");
        
        
        if (id < 0) { 
          throw new HttpException("Invalid Request", HttpStatus.BAD_REQUEST)
        }

        this.todos[id] = {...todo};

        return this.todos;
      }
    
      delete(id: number): void {
        console.log(id, "--dddddddd");

        if (id < 0) { 
          throw new HttpException("Invalid Request", HttpStatus.BAD_REQUEST)
        }

        this.todos.splice(id, 1);
      }
}
