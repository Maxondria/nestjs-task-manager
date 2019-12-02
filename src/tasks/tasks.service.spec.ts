import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});

const mockUser = { username: 'Testing User' };

describe('Tasks Service', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks()', () => {
    it('should return all tasks from the tasks repo', async () => {
      taskRepository.getTasks.mockResolvedValue('Some Tasks');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDTO = {
        status: TaskStatus.IN_PROGRESS,
        search: 'search',
      };

      const tasks = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(tasks).toEqual('Some Tasks');
    });
  });
});
