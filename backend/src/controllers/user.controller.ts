import { Request, Response } from "express";
import { errorHandler, sendError, sendSuccess } from "@utils";
import * as Yup from "yup";
import User from "src/entity/user.entity";

class UserController {
  async create_api_key(req: Request, res: Response) {
    const { first_name, last_name, email } = req.body;
    const schema = await Yup.object().shape({
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      email: Yup.string().email().required(),
    });
    try {
      await schema.validate(req.body, { abortEarly: false });
      const user = await User.findOne({
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
      const userCreated = await User.create({
        first_name,
        last_name,
        email,
      });
      await userCreated.save();
      return sendSuccess({
        res,
        status: 201,
        message: "API key created successfully",
        data: userCreated,
      });
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}

export default UserController;
