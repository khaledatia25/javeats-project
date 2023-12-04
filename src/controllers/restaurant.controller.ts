import { queryList } from "../db/quiries";
import Logger from "../services/loggerService";
import { isRestaurantListItem } from "../types/restaurant.types";
import { RequestWithUser } from "../types/user.types";
import query from "../db/connection";
import { Response, Request } from "express";
const logger = new Logger("restaurantController");

export const createRrestaurant = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    const { user } = req;
    const { cuisine, city, street, building_number, restaurant_name } =
      req.body;
    if (
      typeof cuisine !== "string" ||
      typeof city !== "string" ||
      typeof street !== "string" ||
      typeof building_number !== "number" ||
      typeof restaurant_name !== "string"
    ) {
      res.status(500).send({
        error:
          "cuisine, city, street, building_number, restaurant_name must be provided",
      });
      return;
    }
    const countOwnerIdQuery = queryList.COUNT_OWNER_ID as string;
    const countQueryResult = await query(countOwnerIdQuery, [user.id]);
    if (countQueryResult.rows[0]) {
      res.status(500).send({
        error:
          "This owner account already have a restaurant, Only one allowed for each account",
      });
      return;
    }
    const createRestaurantQuery = queryList.CREATE_RESTAURANT_QUERY;
    const result = await query(createRestaurantQuery as string, [
      user.id,
      restaurant_name,
      cuisine,
      city,
      street,
      building_number,
    ]);
    console.log(result);
    logger.info(
      `An owner with id = ${user.id} and email = ${user.email} has added a restaurant`,
      { restaurant_name, cuisine, city, street, building_number }
    );
    res.status(200).send({ message: "restaurant created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const listRestaurants = async (_req: Request, res: Response) => {
  try {
    const listRestaurantsQuery = queryList.LIST_RESTAURANTS_QUERY;

    const result = await query(listRestaurantsQuery as string, []);
    if (!isRestaurantListItem(result.rows[0])) {
      res
        .status(500)
        .send({ error: "something went wrong please try again later." });
      return;
    }
    res.status(200).send({ restaurants: result.rows });
  } catch (e) {
    console.log(e);
    res
      .status(e)
      .send({ error: "something has gone wrong, please try again later." });
  }
};

export const updateRestaurant = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    const columns = Object.keys(req.body);
    if (columns.length === 0) {
      res.status(500).send({ error: "error" });
      return;
    }
    const user_id = req.user.id;
    const restaurantUpdateQuery = (
      queryList.RESTAURANT_UPDATE_QUERY as (obj: string) => string
    )(req.body);
    console.log(restaurantUpdateQuery);
    console.log(req.body);
    const result = await query(restaurantUpdateQuery, [
      ...columns.map((el) => req.body[el]),
      user_id,
    ]);
    console.log(result);
    res.status(200).send({ message: "restaurant updated successfully" });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: "something has gone worng, please try again later." });
  }
};
