import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IAPIKey } from "../interfaces";
import { CustomBaseEntity } from "./base.entity";

@Entity({
  name: "api_key",
  orderBy: {
    created_at: "ASC",
  },
})
export default class APIKey extends CustomBaseEntity implements IAPIKey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  api_key!: string;

  @Column({ type: "int", unique: false })
  user_id!: number;

  @Column({ type: "boolean" })
  is_active!: boolean;

  @Column({ type: "int", default: 0})
  total_request!: number;

  @Column({ type: "int" })
  violation!: number;

  @Column({ type: "int" })
  violation_limit!: number;

  @Column({ type: "int", default: 0 })
  fill_pdf_by_name_request!: number;

  @Column({ type: "int", default: 0 })
  fill_pdf_by_url_request!: number;

  @Column({ type: "int", default: 0 })
  get_fillable_fields_by_url_request!: number;

  @Column({ type: "int", default: 0 })
  get_fillable_fields_by_buffer_request!: number;
}
