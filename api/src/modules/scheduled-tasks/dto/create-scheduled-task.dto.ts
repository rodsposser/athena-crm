import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum ScheduledTaskType {
  CALL = 'CALL',
  MEETING = 'MEETING',
  CALLBACK = 'CALLBACK',
  EMAIL = 'EMAIL',
}

export class CreateScheduledTaskDto {
  @IsString()
  leadId: string;

  @IsEnum(ScheduledTaskType)
  type: ScheduledTaskType;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
