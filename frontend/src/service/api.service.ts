import { IUser } from "@/interfaces";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/keys";

const create_api_key = async (formData: Partial<IUser>) => {
  const { data } = await axios.post(`${API_URL}/create-api-key`, formData);
  return data?.data;
};

const get_api_key = async (formData: Partial<IUser>) => {
  const { data } = await axios.post(`${API_URL}/get-api-key`, formData);
  return data?.data;
};

const refresh_api_key = async (formData: Partial<IUser>) => {
  const { data } = await axios.put(`${API_URL}/refresh-api-key`, formData);
  return data?.data;
};

export default {
  create_api_key,
  get_api_key,
  refresh_api_key,
};
