import { queryList } from "@/db/quiries.ts";
import Logger from "@/services/loggerService.ts";
import { RequestWithUser, isUserProfile } from "@/types/user.types";
import { signUpErrorMessage } from "@/utils/errorMessages.ts";
import { comparePassword, hashPassword } from "@/utils/hashing.ts";
import { generateToken } from "@/utils/jwtUtil";
import { validateEmail } from "@/utils/validator";
import query from "@db/connection.ts";
import { Request, Response } from "express";

const logger = new Logger("customerController");

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fname,
      lname,
      email,
      username,
      password,
      phone,
      city,
      street,
      home_number,
    } = req.body;
    if (
      !fname ||
      !lname ||
      !email ||
      !username ||
      !password ||
      !phone ||
      !city ||
      !street ||
      !home_number
    ) {
      res.status(500).send({
        error:
          "fname, lname, email, username, password, phone, city, street and home_number must be provided",
      });
      return;
    }
    const customerSignUpQuery = queryList.CUSTOMER_SIGNUP_QUERY;
    const hashedPassword: string = hashPassword(password);
    const result = await query(customerSignUpQuery as string, [
      fname,
      lname,
      email,
      username,
      hashedPassword,
      "customer",
      phone,
      city,
      street,
      home_number,
    ]);
    console.log(result);

    logger.info("New customer added", { fname, lname, username, email, phone });
    res.status(200).send({ message: "user created successfully" });
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
    const customerLoginQuery = validateEmail(username)
      ? queryList.CUSTOMER_LOGIN_EMAIL_QUERY
      : queryList.CUSTOMER_LOGIN_USERNAME_QUERY;
    const result = await query(customerLoginQuery as string, [username]);
    if (!result.rowCount) {
      logger.info(`User: ["${username}" doesn't exit]`);
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
    const dbResponse = result.rows[0];
    const {
      customer_id,
      email,
      username: db_username,
      user_role,
      password: db_password,
    } = dbResponse;
    if (
      !customer_id ||
      typeof customer_id !== "number" ||
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
      logger.info(`User ["${username}" used invalid password]`);
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
    const token = generateToken({
      id: customer_id,
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
    const cusomerProfileQuery = queryList.CUSTOMER_PROFILE_DATA;
    const result = await query(cusomerProfileQuery as string, [user.id]);
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
    res.status(500).send({ error: "something wrong, please try again later" });
  }
};
