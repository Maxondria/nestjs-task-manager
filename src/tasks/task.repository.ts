import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const task = new Task();

    task.title = createTaskDTO.title;
    task.description = createTaskDTO.description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;
    return task;
  }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
 
    const tasks = await query.getMany();
    return tasks;
  }
}
