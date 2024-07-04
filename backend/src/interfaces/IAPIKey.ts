import IBase from "./IBase";

export default interface IAPIKey extends IBase {
  api_key: string;
  user_id: number;
  is_active: boolean;
  total_request: number;
  violation: number;
  violation_limit: number;
}
