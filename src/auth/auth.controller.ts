import {
  Controller,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ToAuthUserDto } from './dto';
import { AuthService } from './auth.service';
import { loginRegistrationValidationPipe } from './loginValidation.pipe';
import { t } from '../config/translation';
import { UsersService } from '../users';

@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(loginRegistrationValidationPipe)
  async login(@Body() body: ToAuthUserDto): Promise<{ accessToken: string }> {
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
      accessToken: this._authService.login(user),
    };
  }

  @Post('register')
  @UsePipes(loginRegistrationValidationPipe)
  async register(@Body() body: ToAuthUserDto): Promise<{
    accessToken: string;
  }> {
    const existing = await this._usersService.findOneByEmail(body.email);

    if (existing) {
      throw new BadRequestException(
        t().errorMessages.validation.userAlreadyExists,
      );
    }

    const user = await this._authService.register(body);

    return {
      accessToken: this._authService.login(user),
    };
  }
}
