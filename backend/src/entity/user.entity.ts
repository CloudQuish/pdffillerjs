import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IUser } from "../interfaces";
import { CustomBaseEntity } from "./base.entity";

@Entity({
  name: "user",
  orderBy: {
    created_at: "ASC",
  },
})
export default class User extends CustomBaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

  @Column({ type: "text" })
  email!: string;
}
