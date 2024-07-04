import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert
} from "typeorm";


import { IUser } from "../interfaces";
import { CustomBaseEntity } from "./base.entity";
import APIKey from "./api.entity";
import { create_unique_api_key } from "src/utils/apikey";

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

 

  @BeforeInsert()
  async beforeInsert() {
    const newApiKey = await create_unique_api_key();
    await APIKey.create({
      api_key: newApiKey,
      is_active: true,
      total_request: 0,
      violation: 0,
      violation_limit: 100,
    }).save();
  }
}
