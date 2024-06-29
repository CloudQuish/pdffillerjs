import { UserEntity } from "@entity";

declare module "express" {
  interface Request {
    user?: UserEntity;
  }
}
