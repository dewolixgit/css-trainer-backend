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
