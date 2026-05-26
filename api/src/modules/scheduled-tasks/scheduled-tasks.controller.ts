import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { CreateScheduledTaskDto } from './dto/create-scheduled-task.dto';
import { CompleteScheduledTaskDto } from './dto/complete-scheduled-task.dto';
import { CurrentOrg, CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../common/decorators/current-user.decorator';

@Controller('scheduled-tasks')
export class ScheduledTasksController {
  constructor(private readonly service: ScheduledTasksService) {}

  @Get()
  findByPeriod(
    @CurrentOrg() orgId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    return this.service.findByPeriod(orgId, dateFrom, dateTo);
  }

  @Get('metrics')
  findMetrics(
    @CurrentOrg() orgId: string,
    @Query('date') date: string,
  ) {
    return this.service.findMetrics(orgId, date || new Date().toISOString().slice(0, 10));
  }

  @Get('leads/search')
  searchLeads(
    @CurrentOrg() orgId: string,
    @Query('q') query: string,
  ) {
    return this.service.searchLeads(orgId, query || '');
  }

  @Post()
  create(
    @CurrentOrg() orgId: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateScheduledTaskDto,
  ) {
    return this.service.create(orgId, user.sub, dto);
  }

  @Patch(':id/complete')
  complete(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() dto: CompleteScheduledTaskDto,
  ) {
    return this.service.complete(orgId, id, dto);
  }

  @Patch(':id/cancel')
  cancel(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
  ) {
    return this.service.cancel(orgId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.service.remove(orgId, id);
  }
}
