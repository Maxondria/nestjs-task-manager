import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

const mockUser = { id: 1, username: 'Testing User' };
const mockTask = { title: 'Task', description: 'I am Task' };

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

  describe('getTaskById()', () => {
    it('should return a task successfully', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById('some-id', mockUser);
      expect(result).toMatchObject(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'some-id', userId: mockUser.id },
      });
    });

    it('should throw an error if task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('xxx', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask()', () => {
    it('should create and return a new task', async () => {
      taskRepository.createTask.mockResolvedValue(mockTask);

      const newTask: CreateTaskDTO = mockTask;
      const result = await tasksService.createTask(newTask, mockUser);
      expect(result).toMatchObject(mockTask);
    });
  });
});
