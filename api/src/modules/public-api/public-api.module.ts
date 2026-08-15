import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api.controller';
import { WebhookDebugController } from './webhook-debug.controller';
import { SchedulingWebhookController } from './scheduling-webhook.controller';
import { FormWebhookController } from './form-webhook.controller';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { LeadTrackingModule } from '../lead-tracking/lead-tracking.module';

@Module({
  imports: [ApiKeysModule, LeadTrackingModule],
  controllers: [PublicApiController, WebhookDebugController, SchedulingWebhookController, FormWebhookController],
})
export class PublicApiModule {}
