import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
    OneToMany,
} from "typeorm";

import crypto from "crypto";
import bcrypt from "bcryptjs";

import { IUser } from "../interfaces";
import { FileEntity } from "@entity";

@Entity({
  name: "user",
  orderBy: {
    created_at: "ASC",
  },
})
export default class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  first_name!: string;

  @Column({ type: "text" })
  last_name!: string;

  @Column({ type: "text" })
  email!: string;

  @Column({ type: "text", select: false })
  password!: string;

  @Column({
    type: "text",
    select: false,
    enum: ["credentials", "google", "facebook"],
  })
  provider!: "credentials" | "google" | "facebook";

  @Column({ type: "text", select: false })
  provider_id!: string;

  @OneToMany(() => FileEntity, (file) => file.user)
  file!: FileEntity[];

  // default columns
  @CreateDateColumn({ select: false })
  created_at!: Date;

  @UpdateDateColumn({ select: false })
  updated_at!: Date;

  @DeleteDateColumn({ select: false })
  deleted_at!: Date;

  @BeforeInsert()
  async beforeInsert() {
    if (this.provider === "credentials") {
      this.provider_id = crypto.createHmac("sha256", this.email).digest("hex");
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
