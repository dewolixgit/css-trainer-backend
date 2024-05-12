import {
  Controller,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { ToAuthUserDto } from './dto/ToAuthUserDto';
import { AuthService } from './auth.service';
import { loginRegistrationValidationPipe } from './loginValidation.pipe';
import { t } from '../config/translation';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwtAuth.guard';
import { AuthenticatedRequest } from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(loginRegistrationValidationPipe)
  async login(
    @Body() body: ToAuthUserDto,
  ): Promise<{ id: number; email: string; accessToken: string }> {
    const user = await this._authService.validateUser({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      throw new UnauthorizedException(
        t().errorMessages.validation.wrongAuthentication,
      );
    }

    return {
      id: user.id,
      email: user.email,
      accessToken: this._authService.login(user),
    };
  }

  @Post('register')
  @UsePipes(loginRegistrationValidationPipe)
  async register(
    @Body() body: ToAuthUserDto,
  ): Promise<{ id: number; email: string; accessToken: string }> {
    const existing = await this._usersService.findOneByEmail(body.email);

    if (existing) {
      throw new BadRequestException(
        t().errorMessages.validation.userAlreadyExists,
      );
    }

    const user = await this._authService.register(body);

    return {
      id: user.id,
      email: user.email,
      accessToken: this._authService.login(user),
    };
  }

  @Get('authorize')
  @UseGuards(JwtAuthGuard)
  async authorize(@Req() request: AuthenticatedRequest): Promise<{
    id: number;
    email: string;
    accessToken: string;
  }> {
    const user = await this._usersService.findOneById(request.user.userId);

    if (!user) {
      throw new UnauthorizedException(
        t().errorMessages.validation.authorizationError,
      );
    }

    return {
      id: user.id,
      email: user.email,
      accessToken: this._authService.login(user),
    };
  }
}
