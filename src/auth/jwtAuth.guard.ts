import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Guard that checks if the request has a valid JWT token in header "Authorization".
 * The execution passes to validate method of JwtStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
