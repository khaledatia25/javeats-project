import { queryList } from "../db/quiries";
import Logger from "../services/loggerService";
import { signUpErrorMessage } from "../utils/errorMessages";
import { RequestWithUser, isUserProfile } from "../types/user.types";
import { comparePassword, hashPassword } from "../utils/hashing";
import { generateToken } from "../utils/jwtUtil";
import { validateEmail } from "../utils/validator";
import query from "../db/connection";
import { Request, Response } from "express";

const logger = new Logger("adminController");

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
    const adminSignUpQuery = queryList.ADMIN_SIGNUP_QUERY;
    const hashedPassword: string = hashPassword(password);
    const result = await query(adminSignUpQuery as string, [
      fname,
      lname,
      email,
      username,
      hashedPassword,
      "admin",
      phone,
    ]);
    console.log(result);

    logger.info("New Admin added", { fname, lname, username, email, phone });
    res.status(200).send({ message: "Admin created successfully" });
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
    const adminLoginQuery = validateEmail(username)
      ? queryList.ADMIN_LOGIN_EMAIL_QUERY
      : queryList.ADMIN_LOGIN_USERNAME_QUERY;
    const result = await query(adminLoginQuery as string, [username]);
    if (!result.rowCount) {
      logger.error(`Admin: ["${username}" doesn't exit]`);
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
    const dbResponse = result.rows[0];
    const {
      admin_id,
      email,
      username: db_username,
      user_role,
      password: db_password,
    } = dbResponse;
    if (
      !admin_id ||
      typeof admin_id !== "number" ||
      !email ||
      typeof email !== "string" ||
      !db_username ||
      typeof db_username !== "string" ||
      !user_role ||
      typeof user_role !== "string" ||
      !db_password ||
      typeof db_password !== "string"
    ) {
      logger.error(`Admin ["${username}" has invalid data in the database]`);
      res.status(500).send({ error: "Invalid username or password" });
      return;
    }
    if (!comparePassword(password, db_password)) {
      logger.error(`User ["${username}" used invalid password]`);
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
    const token = generateToken({
      id: admin_id,
      email: email,
      role: user_role,
      username: username,
    });
    console.log(token);
    logger.info(`Admin ["${username}" logged in]`);
    res.status(200).send(JSON.stringify(token));
  } catch (e) {
    logger.error(`Admin: ["${req.body.username}" login failed]`);
    res
      .status(500)
      .send({ error: "something has gone wrong, please try again later" });
  }
};

export const getProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    const adminProfileQuery = queryList.ADMIN_PROFILE_DATA;
    const result = await query(adminProfileQuery as string, [user.id]);
    if (!result.rowCount) {
      logger.error(`Admin: ["${user.username}" doesn't exit]`);
      res.status(500).send({ error: "There is no data for that user" });
      return;
    }
    if (!isUserProfile(result.rows[0])) {
      logger.error(
        `Admin: ["${user.username}" has invalid data in the database]`
      );
      res.status(500).send({ error: "something has gone wrong" });
      return;
    }
    logger.info(`Admin: ["${user.username}" profile data requested]`);
    res.status(200).send(result.rows[0]);
  } catch (e) {
    logger.error(`Admin: ["${req.user.username}" profile data request failed]`);
    console.log(e);
    res.status(500).send({ error: "something wrong, please try again later" });
  }
};
