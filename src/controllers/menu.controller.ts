import { queryList } from "../db/quiries";
import Logger from "../services/loggerService";
import { RequestWithUser } from "../types/user.types";
import query from "../db/connection";
import { Response, Request } from "express";
const logger = new Logger("menuController");

export const createMenu = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { menu_name, description, price } = req.body;
    if (
      typeof menu_name !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number"
    ) {
      res.status(500).send({
        error: "menu_name, description, price must be provided",
      });
      return;
    }
    const createMenuQuery = queryList.CREATE_MENU_QUERY as string;
    const result = await query(createMenuQuery, [
      user.id,
      menu_name,
      description,
      price,
    ]);
    console.log(result);
    logger.info(
      `An owner with id = ${user.id} and email = ${user.email} has added a menu`,
      { menu_name, description, price }
    );
    res.status(200).send({ message: "menu created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const listMenus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const restaurant_id = Number(id);
    const listMenusQuery = queryList.LIST_MENUS_QUERY as string;
    const result = await query(listMenusQuery, [restaurant_id]);

    res.status(200).send({ menus: result.rows });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const updateMenu = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { user } = req;
    const menu_id = Number(id);
    // check if the user is the owner of the menu
    const checkOwnerQuery = queryList.CHECK_OWNER_QUERY as string;
    const checkOwnerResult = await query(checkOwnerQuery, [
      user.id,
      menu_id as number,
    ]);
    if (checkOwnerResult.rowCount === 0) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }

    // update menu code
    const columns = Object.keys(req.body);
    if (columns.length === 0) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const menuUpdateQuery = (
      queryList.MENU_UPDATE_QUERY as (obj: string) => string
    )(req.body);
    const menuUpdateQueryResult = await query(menuUpdateQuery, [
      ...columns.map((el) => req.body[el]),
      menu_id,
    ]);
    console.log(menuUpdateQueryResult);
    logger.info(
      `An owner with id = ${user.id} and email = ${user.email} has updated a menu`,
      { menu_id, ...req.body }
    );
    res.status(200).send({ message: "menu updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const deleteMenu = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    const { id } = req.params;
    if (Number.isNaN(id)) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const menu_id = Number(id);
    // check if the user is the owner of the menu
    const checkOwnerQuery = queryList.CHECK_OWNER_QUERY as string;
    const checkOwnerResult = await query(checkOwnerQuery, [user.id, menu_id]);
    if (checkOwnerResult.rowCount === 0) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }

    // delete menu code
    const deleteMenuQuery = queryList.DELETE_MENU_QUERY as string;
    const deleteMenuQueryResult = await query(deleteMenuQuery, [menu_id]);
    console.log(deleteMenuQueryResult);
    logger.info(
      `An owner with id = ${user.id} and email = ${user.email} has deleted a menu`,
      { menu_id }
    );
    res.status(200).send({ message: "menu deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};
