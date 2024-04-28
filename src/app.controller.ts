import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { AuthenticatedRequest } from './auth/types';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() req: AuthenticatedRequest): string {
    console.log(req.user);
    return this._appService.getHello();
  }
}
