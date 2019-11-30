import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v4';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasks(filterDTO: GetTasksFilterDTO): Task[] {
    const { search, status } = filterDTO;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return tasks;
  }
  
  createTask(createTaskDTO: CreateTaskDTO): Task {
    const task: Task = {
      id: uuid(),
      ...createTaskDTO,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  deleteTask(id: string): string {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return 'deleted successfully';
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
