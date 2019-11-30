import { PipeTransform, BadGatewayException } from '@nestjs/common';
import { TaskStatus } from '../tasks.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus: TaskStatus[] = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  isStatusNotValid(status: any) {
    return this.allowedStatus.indexOf(status) === -1;
  }

  transform(value: any) {
    value = value.toUpperCase();

    if (this.isStatusNotValid(value)) {
      throw new BadGatewayException('Status is not valid');
    }
    return value;
  }
}
