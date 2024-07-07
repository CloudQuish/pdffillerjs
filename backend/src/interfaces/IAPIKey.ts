import IBase from "./IBase";

export default interface IAPIKey extends IBase {
  api_key: string;
  user_id: number;
  is_active: boolean;
  total_request: number;
  violation: number;
  violation_limit: number;
  fill_pdf_by_name_request: number;
  fill_pdf_by_url_request: number;
  get_fillable_fields_by_url_request: number;
  get_fillable_fields_by_buffer_request: number;
}
