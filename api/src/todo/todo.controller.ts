import { Body, Controller, Delete, Get, Param, Post, Put, } from '@nestjs/common';
import { TodoDto } from '../dto/todo.dto';
import { TodosService } from './todo.service';

@Controller('todo')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  
  @Post()
  create(@Body() todo: TodoDto){
    return this.todosService.create(todo);
  }

  @Get()
  getAll(){
    return this.todosService.getAll();
  }

  @Put("/:id") 
  update(@Param("id") id: number, @Body() todo: TodoDto){
    return this.todosService.update(id, todo);
  }

  @Delete("/:id")
  delete(@Param("id") id: number){
    return this.todosService.delete(id);
  }
}
