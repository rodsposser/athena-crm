import { Controller, Post, Get, Body, Headers, Query, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';

// Endpoint temporário, sem autenticação, só pra descobrir o formato real do
// payload que uma ferramenta externa manda (quando ela só oferece um campo de
// URL crua, sem header/body customizável). Aceita QUALQUER coisa e guarda —
// não usar em produção depois de identificado o formato real. Remover assim
// que a integração definitiva estiver pronta.
@Controller('public/v1/webhooks/capture')
@Public()
export class WebhookDebugController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async capture(@Body() body: unknown, @Headers() headers: unknown, @Query() query: unknown) {
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO webhook_debug_captures (headers, body, query) VALUES ($1::jsonb, $2::jsonb, $3::jsonb)`,
      JSON.stringify(headers ?? {}),
      JSON.stringify(body ?? {}),
      JSON.stringify(query ?? {}),
    );
    return { ok: true };
  }

  // Alguns webhooks fazem um GET de verificação antes de aceitar a URL —
  // aceita também, pra não travar essa checagem.
  @Get()
  async verify(@Query() query: unknown, @Req() req: any) {
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO webhook_debug_captures (headers, body, query) VALUES ($1::jsonb, $2::jsonb, $3::jsonb)`,
      JSON.stringify(req.headers ?? {}),
      JSON.stringify({ note: 'GET verification ping' }),
      JSON.stringify(query ?? {}),
    );
    return { ok: true };
  }
}
