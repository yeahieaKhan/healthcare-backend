import { IRequestUser } from "./requestUser";

declare global {
  namespace Express {
    interface Request {
      user: IRequestUser;
    }
  }
}
