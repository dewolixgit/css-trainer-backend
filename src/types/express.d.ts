declare global {
  namespace Express {
    interface User {
      userId: number;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
