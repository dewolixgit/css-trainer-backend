import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

export type ServiceResponse<D = undefined, E = undefined> =
  | (E extends undefined
      ? {
          isError: true;
        }
      : {
          isError: true;
          data: E;
        })
  | (D extends undefined
      ? {
          isError: false;
        }
      : {
          isError: false;
          data: D;
        });

export type ServicePromiseResponse<D = undefined, E = undefined> = Promise<
  ServiceResponse<D, E>
>;

export type ServicePromiseHttpResponse<D = undefined> = ServicePromiseResponse<
  D,
  {
    code: ErrorHttpStatusCode;
    message: string;
  }
>;
