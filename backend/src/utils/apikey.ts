import { APIKey } from "@entity";
import crypto from "crypto";
export const create_unique_api_key = async (
  length: number = 12
): Promise<string> => {
  const api_key = crypto.randomBytes(length).toString("hex");
  const isExists = await APIKey.findOne({
    where: {
      api_key,
    },
  });
  if (isExists) {
    return create_unique_api_key(length);
  }
  return api_key;
};
