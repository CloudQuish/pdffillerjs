import { APIKeyConotroller } from "@controllers/index";
import { Router } from "express";

const APIRouter = Router();
const apiKeyController = new APIKeyConotroller();

APIRouter.post("/create-api-key", apiKeyController.create_api_key);
APIRouter.post("/get-api-key", apiKeyController.get_api_key);
APIRouter.put("/refresh-api-key", apiKeyController.refresh_api_key);

export default APIRouter;
