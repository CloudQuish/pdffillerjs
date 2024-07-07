import { Request, Response } from "express";
import { TransActionUtil, errorHandler, sendError, sendSuccess } from "@utils";
import * as Yup from "yup";
import { APIKey, UserEntity } from "@entity";
import { create_unique_api_key } from "src/utils/apikey";
import { EmailSenderService } from "@services";
import { email_templates } from "@config";

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
          message: "User already exists | Request/Refresh API key",
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
      const variables = [
        {
          email: email,
          substitutions: [
            {
              var: "first_name",
              value: first_name,
            },
            {
              var: "api_key",
              value: api_key.api_key,
            },
            {
              var: "support_email",
              value: process.env.MAILER_SEND_FROM_CONTACT_EMAIL,
            },
          ],
        },
      ];

      await EmailSenderService.sendEmail({
        sendFromName: process.env.MAILER_SEND_FROM_NAME,
        sendFromEmail: process.env.MAILER_SEND_FROM_EMAIL,
        template_id: email_templates.user_notification.template_id,
        to: email,
        subject: `PDF Filler | API Key Created`,
        replyTo: process.env.MAILER_SEND_FROM_EMAIL,
        variables,
      });
      return sendSuccess({
        res,
        status: 201,
        message:
          "API key created successfully | Check your email for the API key",
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
          message: "User with this email not found | Create new API key",
        });
      }

      const api_key = await APIKey.findOne({
        where: {
          user_id: user.id,
          is_active: true,
        },
      });

      if (!api_key) {
        return sendError({
          res,
          status: 404,
          message: "No active API key found for this user | Create new API key",
        });
      }
      const variables = [
        {
          email: email,
          substitutions: [
            {
              var: "first_name",
              value: user.first_name,
            },
            {
              var: "api_key",
              value: api_key.api_key,
            },
            {
              var: "support_email",
              value: process.env.MAILER_SEND_FROM_CONTACT_EMAIL,
            },
          ],
        },
      ];

      await EmailSenderService.sendEmail({
        sendFromName: process.env.MAILER_SEND_FROM_NAME,
        sendFromEmail: process.env.MAILER_SEND_FROM_EMAIL,
        template_id: email_templates.user_notification.template_id,
        to: email,
        subject: `PDF Filler | API Key Retrieved`,
        replyTo: process.env.MAILER_SEND_FROM_EMAIL,
        variables,
      });

      return sendSuccess({
        res,
        status: 200,
        message: "API key found | Check your email for the API key",
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
          message: "User with this email not found | Create new API key",
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
          message: "API key not found | Create new API key",
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
      const variables = [
        {
          email: email,
          substitutions: [
            {
              var: "first_name",
              value: user.first_name,
            },
            {
              var: "api_key",
              value: new_api_key,
            },
            {
              var: "support_email",
              value: process.env.MAILER_SEND_FROM_CONTACT_EMAIL,
            },
          ],
        },
      ];
      await EmailSenderService.sendEmail({
        sendFromName: process.env.MAILER_SEND_FROM_NAME,
        sendFromEmail: process.env.MAILER_SEND_FROM_EMAIL,
        template_id: email_templates.user_notification.template_id,
        to: email,
        subject: `PDF Filler | API Key Refreshed`,
        replyTo: process.env.MAILER_SEND_FROM_EMAIL,
        variables,
      });
      return sendSuccess({
        res,
        status: 200,
        message: "API key refreshed | Check your email for the new API key",
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
