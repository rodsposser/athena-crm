import { IsString, IsOptional } from 'class-validator';

export class CompleteScheduledTaskDto {
  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsString()
  movedToStatusId?: string;
}
