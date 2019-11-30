import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsIn } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
