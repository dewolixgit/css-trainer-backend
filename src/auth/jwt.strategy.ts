import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload, RequestUserPayload } from './types';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesKeys } from '../config/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: _configService.get(EnvironmentVariablesKeys.jwtSecret),
    });
  }

  /**
   * Returned payload is assigned to "user" field in a request object
   */
  validate(payload: JwtPayload): RequestUserPayload {
    return { userId: payload.sub };
  }
}
