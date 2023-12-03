import { queryList } from "@/db/quiries.ts";
import Logger from "@/services/loggerService.ts";
import { convertToOrdersObject } from "@/types/order.types";
import { RequestWithUser } from "@/types/user.types";
import query from "@db/connection.ts";
import { Response } from "express";
const logger = new Logger("orderController");

export const getOrders = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { orderstatus } = req.body;
    if (typeof orderstatus !== "string") {
      res.status(500).send({ error: "orderstatus must be provided" });
      return;
    }
    let getOrdersQuery =
      user.role === "owner"
        ? (queryList.GET_ORDERS_OWNER_QUERY as string)
        : (queryList.GET_ORDERS_CUSTOMER_QUERY as string);
    if (orderstatus !== "all") {
      getOrdersQuery += queryList.GET_ORDERS_WITH_STATUS as string as string;
    } else {
      getOrdersQuery += ";";
    }
    const result = await query(
      getOrdersQuery,
      orderstatus === "all" ? [user.id] : [user.id, orderstatus]
    );
    if (result.rowCount === 0) {
      res.status(500).send({ error: "No orders found" });
      return;
    }
    logger.info(`An ${user.role} with id = ${user.id} has fetched orders`);
    res.status(200).send({ orders: convertToOrdersObject(result.rows) });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const placeOrder = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    // place order
    const placeOrderQuery = queryList.PLACE_ORDER_QUERY as string;
    const result = await query(placeOrderQuery, [user.id, "pending"]);
    console.log(result);
    logger.info(
      `An customer with id = ${user.id} and email = ${user.email} has placed an order`
    );

    // remove meus from cart
    const removeCartItemsQuery = queryList.REMOVE_CART_ITEMS_QUERY as string;
    await query(removeCartItemsQuery, [user.id]);
    res.status(200).send({ message: "order placed successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const cancelOrder = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }

    const { order_id } = req.body;
    if (typeof order_id !== "number") {
      res.status(500).send({ error: "order_id must be provided" });
      return;
    }
    //check if order belongs to user
    const getOrderQuery = queryList.GET_ORDER_QUERY as string;
    const getOrderQueryResult = await query(getOrderQuery, [order_id, user.id]);
    if (getOrderQueryResult.rowCount === 0) {
      res.status(500).send({ error: "order not found" });
      return;
    }
    const cancelOrderQuery = queryList.CANCEL_ORDER_QUERY as string;
    const result = await query(cancelOrderQuery, [order_id]);
    console.log(result);
    logger.info(
      `An ${user.role} with id = ${user.id} and email = ${user.email} has cancelled an order`
    );
    res.status(200).send({ message: "order cancelled successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const updateOrder = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }

    const { order_id, orderstatus } = req.body;
    if (typeof order_id !== "number") {
      res.status(500).send({ error: "order_id must be provided" });
      return;
    }
    if (typeof orderstatus !== "string") {
      res.status(500).send({ error: "orderstatus must be provided" });
      return;
    }
    //check if order belongs to user
    const getOrderQuery = queryList.GET_ORDER_OWNER_QUERY as string;
    const getOrderQueryResult = await query(getOrderQuery, [user.id, order_id]);
    if (getOrderQueryResult.rowCount === 0) {
      res.status(500).send({ error: "order not found" });
      return;
    }
    const updateOrderQuery = queryList.UPDATE_ORDER_QUERY as string;
    const result = await query(updateOrderQuery, [orderstatus, order_id]);
    console.log(result);
    logger.info(
      `An ${user.role} with id = ${user.id} and email = ${user.email} has updated an order`
    );
    res.status(200).send({ message: "order updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};
