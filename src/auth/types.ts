import { Request } from 'express';

export type RequestUserPayload = {
  userId: number;
};

export type AuthenticatedRequest = Request & {
  user: RequestUserPayload;
};

export enum PassportStrategiesEnum {
  jwt = 'jwt',
}

export enum JwtPayloadFieldsEnum {
  sub = 'sub',
}

export type JwtPayload = {
  [JwtPayloadFieldsEnum.sub]: number;
};
