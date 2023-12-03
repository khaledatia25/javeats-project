import { queryList } from "@/db/quiries.ts";
import Logger from "@/services/loggerService.ts";
import { RequestWithUser } from "@/types/user.types";
import query from "@db/connection.ts";
import { Response } from "express";
const logger = new Logger("cartItemController");

export const getCartItems = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const getCartItemsQuery = queryList.GET_CART_ITEMS_QUERY as string;
    const result = await query(getCartItemsQuery, [user.id]);

    res.status(200).send({ menus: result.rows });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const addToCart = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { menu_id, quantity } = req.body;
    if (typeof menu_id !== "number" || typeof quantity !== "number") {
      res.status(500).send({
        error: "menu_id and quantity must be provided",
      });
      return;
    }
    const addToCartQuery = queryList.ADD_TO_CART_QUERY as string;
    const result = await query(addToCartQuery, [user.id, menu_id, quantity]);
    console.log(result);
    logger.info(
      `An customer with id = ${user.id} and email = ${user.email} has added a menu to cart`,
      { menu_id, quantity }
    );
    res.status(200).send({ message: "menu added to cart successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const removeFromCart = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { menu_id } = req.body;
    if (typeof menu_id !== "number") {
      res.status(500).send({
        error: "menu_id must be provided",
      });
      return;
    }
    const removeFromCartQuery = queryList.REMOVE_FROM_CART_QUERY as string;
    const result = await query(removeFromCartQuery, [user.id, menu_id]);
    console.log(result);
    logger.info(
      `An customer with id = ${user.id} and email = ${user.email} has removed a menu from cart`,
      { menu_id }
    );
    res.status(200).send({ message: "menu removed from cart successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const updateCartItem = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { menu_id, quantity } = req.body;
    if (typeof menu_id !== "number" || typeof quantity !== "number") {
      res.status(500).send({
        error: "menu_id and quantity must be provided",
      });
      return;
    }
    const updateCartItemQuery = queryList.UPDATE_CART_ITEM_QUERY as string;
    const result = await query(updateCartItemQuery, [
      quantity,
      user.id,
      menu_id,
    ]);
    console.log(result);
    logger.info(
      `An customer with id = ${user.id} and email = ${user.email} has updated a menu in cart`,
      { menu_id, quantity }
    );
    res.status(200).send({ message: "menu updated in cart successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};
