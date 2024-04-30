import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ToAuthUserDto } from './dto/ToAuthUserDto';
import { RegisteredUserDto } from './dto/RegisteredUserDto';
import { JwtService } from '@nestjs/jwt';
import { PASSWORD_HASH_SALT_ROUNDS } from './config';
import { compare, hash } from 'bcrypt';
import { JwtPayload, JwtPayloadFieldsEnum } from './types';

@Injectable()
export class AuthService {
  constructor(
    private _usersService: UsersService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(userToValidate: {
    email: string;
    password: string;
  }): Promise<RegisteredUserDto | null> {
    const user = await this._usersService.findOneByEmail(userToValidate.email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(
      userToValidate.password,
      user.password,
    );

    if (isPasswordValid) {
      return {
        id: user.id,
        email: user.email,
      };
    }

    return null;
  }

  login(user: RegisteredUserDto): string {
    const payload: JwtPayload = { [JwtPayloadFieldsEnum.sub]: user.id };

    return this._jwtService.sign(payload);
  }

  async register(user: ToAuthUserDto): Promise<RegisteredUserDto> {
    const hashedPassword = await hash(user.password, PASSWORD_HASH_SALT_ROUNDS);

    const created = await this._usersService.create({
      email: user.email,
      password: hashedPassword,
    });

    return {
      id: created.id,
      email: created.email,
    };
  }
}
