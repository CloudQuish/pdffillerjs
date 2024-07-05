import { Request, Response } from "express";
import { TransActionUtil, errorHandler, sendError, sendSuccess } from "@utils";
import * as Yup from "yup";
import { APIKey, UserEntity } from "@entity";
import { create_unique_api_key } from "src/utils/apikey";

class APIKEYController {
  async create_api_key(req: Request, res: Response) {
    const { first_name, last_name, email } = req.body;
    const schema = await Yup.object().shape({
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      email: Yup.string().email().required(),
    });
    const queryRunner = await TransActionUtil.startNewTransaction();
    try {
      await schema.validate(req.body, { abortEarly: true });

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: {
          email,
        },
      });
      if (user) {
        return sendError({
          res,
          status: 400,
          message: "User already exists | Request new API key",
        });
      }

      const userCreated = await queryRunner.manager.save(
        UserEntity.create({
          first_name,
          last_name,
          email,
        })
      );

      const api_key = await queryRunner.manager.save(
        APIKey.create({
          user_id: userCreated.id,
          api_key: await create_unique_api_key(),
          is_active: true,
          total_request: 0,
          violation: 0,
          violation_limit: 100,
        })
      );
      await queryRunner.commitTransaction();
      return sendSuccess({
        res,
        status: 201,
        message: "API key created successfully",
        data: {
          api_key,
          userCreated,
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return errorHandler(res, error);
    } finally {
      await queryRunner.release();
    }
  }

  async get_api_key(req: Request, res: Response) {
    const { email } = req.body;
    const schema = await Yup.object().shape({
      email: Yup.string().email().required(),
    });
    try {
      await schema.validate(req.body, { abortEarly: true });

      const user = await UserEntity.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return sendError({
          res,
          status: 404,
          message: "User not found",
        });
      }

      const api_key = await APIKey.findOne({
        where: {
          user_id: user.id,
          is_active: true,
        },
      });

      if(!api_key) {
        return sendError({
          res,
          status: 404,
          message: "No active API key found for this user | Request new API key",
        });
      }

      return sendSuccess({
        res,
        status: 200,
        message: "API key found",
        data: {
          api_key,
          user,
        },
      });
    } catch (error) {
      return errorHandler(res, error);
    }
  }

  async refresh_api_key(req: Request, res: Response) {
    const { email } = req.body;
    const schema = await Yup.object().shape({
      email: Yup.string().email().required(),
    });
    const queryRunner = await TransActionUtil.startNewTransaction();
    try {
      await schema.validate(req.body, { abortEarly: true });

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: {
          email,
        },
      });

      if (!user) {
        return sendError({
          res,
          status: 404,
          message: "User not found",
        });
      }

      const api_key = await queryRunner.manager.findOne(APIKey, {
        where: {
          user_id: user.id,
          is_active: true,
        },
      });

      if (!api_key) {
        return sendError({
          res,
          status: 404,
          message: "API key not found",
        });
      }
      api_key.is_active = false;
      await queryRunner.manager.save(api_key);
      const new_api_key = await create_unique_api_key();
      await queryRunner.manager.save(
        APIKey.create({
          user_id: user.id,
          api_key: new_api_key,
          is_active: true,
          total_request: 0,
          violation: 0,
          violation_limit: 100,
        })
      );

      await queryRunner.commitTransaction();
      return sendSuccess({
        res,
        status: 200,
        message: "API key refreshed",
        data: {
          new_api_key,
          user,
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return errorHandler(res, error);
    } finally {
      await queryRunner.release();
    }
  }
}

export default APIKEYController;
