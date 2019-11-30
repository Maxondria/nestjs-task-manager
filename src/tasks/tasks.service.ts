import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filteredDTO: GetTasksFilterDTO): Promise<Task[]> {
    return await this.taskRepository.getTasks(filteredDTO);
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDTO);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('Oops,Task Not Found');
    }
    return found;
  }

  async deleteTask(
    id: string,
  ): Promise<{
    status: string;
  }> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Oops, Task Not Found');
    }
    return { status: 'Success' };
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task: Task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task;
  }
}
