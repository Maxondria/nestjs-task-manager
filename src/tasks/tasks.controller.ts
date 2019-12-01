import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterDTO: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return await this.tasksService.getTasks(filterDTO, user);
  }

  @Post()
  createTask(
    @Body(ValidationPipe) createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
  ): Promise<{
    status: string;
  }> {
    return await this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return await this.tasksService.updateTaskStatus(id, status);
  }
}
