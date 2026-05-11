import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { SkipApiKey } from './shared/decorators/skip-api-key.decorator';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

function HealthDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Health check endpoint' }),
    ApiResponse({ status: 200, description: 'Server is healthy' }),
  );
}

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @SkipApiKey()
  @HealthDocs()
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
