import { queryList } from "@/db/quiries.ts";
import Logger from "@/services/loggerService.ts";
import { RequestWithUser, isUserProfile } from "@/types/user.types";
import { signUpErrorMessage } from "@/utils/errorMessages.ts";
import { comparePassword, hashPassword } from "@/utils/hashing.ts";
import { generateToken } from "@/utils/jwtUtil";
import { validateEmail } from "@/utils/validator";
import query from "@db/connection.ts";
import { Request, Response } from "express";

const logger = new Logger("ownerController");

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fname, lname, email, username, password, phone } = req.body;
    if (!fname || !lname || !email || !username || !password || !phone) {
      res.status(500).send({
        error:
          "fname, lname, email, username, password, phone must be provided",
      });
      return;
    }
    const ownerSignUpQuery = queryList.OWNER_SIGNUP_QUERY;
    const hashedPassword: string = hashPassword(password);
    const result = await query(ownerSignUpQuery as string, [
      fname,
      lname,
      email,
      username,
      hashedPassword,
      "owner",
      phone,
    ]);
    console.log(result);

    logger.info("New Owner added", { fname, lname, username, email, phone });
    res.status(200).send({ message: "Owner created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send(signUpErrorMessage);
  }
};

export const logIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (
      !username ||
      typeof username !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      res
        .status(500)
        .send({ error: "username/email and password must be provided" });
      return;
    }
    const ownerLoginQuery = validateEmail(username)
      ? queryList.OWNER_LOGIN_EMAIL_QUERY
      : queryList.OWNER_LOGIN_USERNAME_QUERY;
    const result = await query(ownerLoginQuery as string, [username]);
    if (!result.rowCount) {
      logger.info(`Owner: ["${username}" doesn't exit]`);
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
    const dbResponse = result.rows[0];
    const {
      owner_id,
      email,
      username: db_username,
      user_role,
      password: db_password,
    } = dbResponse;
    if (
      !owner_id ||
      typeof owner_id !== "number" ||
      !email ||
      typeof email !== "string" ||
      !db_username ||
      typeof db_username !== "string" ||
      !user_role ||
      typeof user_role !== "string" ||
      !db_password ||
      typeof db_password !== "string"
    ) {
      res.status(500).send({ error: "Invalid username or password" });
      return;
    }
    if (!comparePassword(password, db_password)) {
      logger.info(`Owner ["${username}" used invalid password]`);
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
    const token = generateToken({
      id: owner_id,
      email: email,
      role: user_role,
      username: username,
    });
    console.log(token);
    res.status(200).send(JSON.stringify(token));
  } catch (e) {
    res
      .status(500)
      .send({ error: "something has gone wrong, please try again later" });
  }
};

export const getProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    const ownerProfileQuery = queryList.OWNER_PROFILE_DATA;
    const result = await query(ownerProfileQuery as string, [user.id]);
    if (!result.rowCount) {
      res.status(500).send({ error: "There is no data for that user" });
      return;
    }
    if (!isUserProfile(result.rows[0])) {
      res.status(500).send({ error: "something has gone wrong" });
      return;
    }
    res.status(200).send(result.rows[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something wrong, please try again later" });
  }
};
