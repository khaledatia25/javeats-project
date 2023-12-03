import { objectToUpdateStatement } from "@utils/functions";
export const queryList: { [key: string]: string | ((obj: any) => string) } = {
  CUSTOMER_SIGNUP_QUERY: ` WITH inserted_user AS (
    INSERT INTO APP_USER (FNAME, LNAME, EMAIL, USERNAME, PASSWORD, USER_ROLE, PHONE)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING USER_ID
  )
  INSERT INTO CUSTOMER (CUSTOMER_ID, CITY, STREET, HOME_NUMBER)
  VALUES ((SELECT USER_ID FROM inserted_user), $8, $9, $10); `,
  CUSTOMER_LOGIN_USERNAME_QUERY: `SELECT c.customer_id,u.email, u.username,u.user_role, u.password 
	FROM customer as c
	inner join app_user as u
	on c.customer_id = u.user_id
	where u.username = $1;`,
  CUSTOMER_LOGIN_EMAIL_QUERY: `SELECT c.customer_id,u.email, u.username,u.user_role, u.password 
	FROM customer as c
	inner join app_user as u
	on c.customer_id = u.user_id
	where u.email = $1;`,
  CUSTOMER_PROFILE_DATA: ` SELECT 
  C.CUSTOMER_ID as id, 
  U.FNAME, 
  U.LNAME, 
  U.USERNAME, 
  U.EMAIL, 
  TO_CHAR(U.CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as created_at,
  TO_CHAR(U.UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as updated_at,
  U.PHONE, 
  C.CITY, 
  C.STREET, 
  C.HOME_NUMBER
FROM CUSTOMER AS C
INNER JOIN APP_USER AS U
ON C.CUSTOMER_ID = U.USER_ID
WHERE C.CUSTOMER_ID = $1;
 `,
  ADMIN_SIGNUP_QUERY: ` WITH inserted_user AS (
    INSERT INTO APP_USER (FNAME, LNAME, EMAIL, USERNAME, PASSWORD, USER_ROLE, PHONE)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING USER_ID
  )
  INSERT INTO SYSTEM_ADMIN (ADMIN_ID)
  VALUES ((SELECT USER_ID FROM inserted_user)); `,
  ADMIN_LOGIN_USERNAME_QUERY: `SELECT a.admin_id,u.email, u.username,u.user_role, u.password 
	FROM system_admin as a
	inner join app_user as u
	on a.admin_id = u.user_id
	where u.username = $1;`,
  ADMIN_LOGIN_EMAIL_QUERY: `SELECT a.admin_id,u.email, u.username,u.user_role, u.password 
	FROM system_admin as a
	inner join app_user as u
	on a.admin_id = u.user_id
	where u.email = $1;`,
  ADMIN_PROFILE_DATA: `  SELECT 
  A.ADMIN_ID as id, 
  U.FNAME, 
  U.LNAME, 
  U.USERNAME, 
  U.EMAIL, 
  TO_CHAR(U.CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as created_at,
  TO_CHAR(U.UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as updated_at,
  U.PHONE
FROM SYSTEM_ADMIN AS A
INNER JOIN APP_USER AS U
ON A.ADMIN_ID = U.USER_ID
WHERE A.ADMIN_ID = $1;
 `,
  OWNER_SIGNUP_QUERY: ` WITH inserted_user AS (
    INSERT INTO APP_USER (FNAME, LNAME, EMAIL, USERNAME, PASSWORD, USER_ROLE, PHONE)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING USER_ID
  )
  INSERT INTO RESTAURANT_OWNER (OWNER_ID)
  VALUES ((SELECT USER_ID FROM inserted_user)); `,
  OWNER_LOGIN_USERNAME_QUERY: `SELECT o.owner_id, u.email, u.username,u.user_role, u.password 
	FROM restaurant_owner as o
	inner join app_user as u
	on o.owner_id = u.user_id
	where u.username = $1;`,
  OWNER_LOGIN_EMAIL_QUERY: `SELECT o.owner_id,u.email, u.username,u.user_role, u.password 
	FROM restaurant_owner as o
	inner join app_user as u
	on o.owner_id = u.user_id
	where u.email = $1;`,
  OWNER_PROFILE_DATA: ` SELECT 
  O.OWNER_ID as id, 
  U.FNAME, 
  U.LNAME, 
  U.USERNAME, 
  U.EMAIL, 
  TO_CHAR(U.CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as created_at,
  TO_CHAR(U.UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as updated_at,
  U.PHONE
FROM RESTAURANT_OWNER AS O
INNER JOIN APP_USER AS U
ON O.OWNER_ID = U.USER_ID
WHERE O.OWNER_ID = $1;
 `,

  CREATE_RESTAURANT_QUERY: `
 INSERT INTO RESTAURANT (OWNER_ID,
  
  RESTAURANT_NAME,
  CUISINE,
  CITY,
  STREET,
  BUILDING_NUMBER)
VALUES ($1, $2, $3, $4, $5, $6);
 `,
  LIST_RESTAURANTS_QUERY: ` 
  SELECT RESTAURANT_ID,
	  CUISINE,
	  CITY,
	  RESTAURANT_NAME
  FROM PUBLIC.RESTAURANT;
  `,
  COUNT_OWNER_ID: `
    SELECT COUNT(OWNER_ID)
    FROM RESTAURANT 
    WHERE OWNER_ID = $1
  `,
  RESTAURANT_UPDATE_QUERY: (obj: any) => {
    return objectToUpdateStatement("RESTAURANT", "OWNER_ID", obj);
  },
  CREATE_MENU_QUERY: `
  INSERT INTO MENU (RESTAURANT_ID, MENU_NAME, DESCRIPTION, PRICE)  values ( 
    (SELECT RESTAURANT_ID FROM RESTAURANT WHERE OWNER_ID = $1),
    $2, $3, $4);`,
  LIST_MENUS_QUERY: `
    SELECT MENU_ID,RESTAURANT_ID, MENU_NAME, DESCRIPTION, PRICE, CREATED_AT, UPDATED_AT FROM MENU WHERE RESTAURANT_ID = $1;
    `,
  CHECK_OWNER_QUERY: `
    SELECT 
	    O.OWNER_ID, M.MENU_ID, R.RESTAURANT_ID
    FROM RESTAURANT_OWNER O
    INNER JOIN RESTAURANT R
    ON O.OWNER_ID = R.OWNER_ID
    INNER JOIN MENU M
    ON R.RESTAURANT_ID = M.RESTAURANT_ID
    WHERE R.OWNER_ID = $1 AND M.MENU_ID = $2;
    `,
  MENU_UPDATE_QUERY: (obj: any) => {
    return objectToUpdateStatement("MENU", "MENU_ID", obj);
  },
  DELETE_MENU_QUERY: `
  DELETE FROM MENU WHERE MENU_ID = $1;
  `,
  ADD_TO_CART_QUERY: `
  INSERT INTO CART_ITEM (CUSTOMER_ID, MENU_ID, QUANTITY) VALUES ($1, $2, $3);
  `,
  REMOVE_FROM_CART_QUERY: `
  DELETE FROM CART_ITEM WHERE CUSTOMER_ID = $1 AND MENU_ID = $2;
  `,
  UPDATE_CART_ITEM_QUERY: `
  UPDATE CART_ITEM SET QUANTITY = $1 WHERE CUSTOMER_ID = $2 AND MENU_ID = $3;
  `,
  GET_CART_ITEMS_QUERY: `
  SELECT 
    C.CUSTOMER_ID, 
    M.MENU_ID, 
    CI.QUANTITY, 
    M.MENU_NAME, 
    M.PRICE, 
    M.DESCRIPTION,
    R.RESTAURANT_NAME,
	TO_CHAR(CI.CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as created_at,
  TO_CHAR(CI.UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as updated_at
  FROM 
    CUSTOMER AS C
  INNER JOIN CART_ITEM AS CI
  ON C.CUSTOMER_ID = CI.CUSTOMER_ID
  INNER JOIN MENU AS M
  ON CI.MENU_ID = M.MENU_ID
  INNER JOIN RESTAURANT AS R
  ON M.RESTAURANT_ID = R.RESTAURANT_ID
  WHERE C.CUSTOMER_ID = $1;
  `,
  GET_ORDERS_OWNER_QUERY: `
  SELECT 
    O.ORDER_ID,
    O.ORDERSTATUS,
    O.CREATED_AT,
    OM.QUANTITY,
    M.PRICE,
    M.MENU_NAME,
    M.DESCRIPTION,
    R.RESTAURANT_NAME
  FROM
    APP_ORDER AS O
  INNER JOIN ORDER_MENU AS OM
  ON O.ORDER_ID = OM.ORDER_ID
  INNER JOIN MENU AS M
  ON OM.MENU_ID = M.MENU_ID
  INNER JOIN RESTAURANT AS R
  ON M.RESTAURANT_ID = R.RESTAURANT_ID
  WHERE R.OWNER_ID = $1
  `,
  GET_ORDERS_WITH_STATUS: ` AND O.ORDERSTATUS = $2;`,
  GET_ORDERS_CUSTOMER_QUERY: `
  SELECT 
    O.ORDER_ID,
    O.ORDERSTATUS,
    O.CREATED_AT,
    OM.QUANTITY,
    M.PRICE,
    M.MENU_NAME,
    M.DESCRIPTION,
    R.RESTAURANT_NAME
  FROM APP_ORDER AS O
  INNER JOIN ORDER_MENU AS OM
  ON O.ORDER_ID = OM.ORDER_ID
  INNER JOIN MENU AS M
  ON OM.MENU_ID = M.MENU_ID
  INNER JOIN RESTAURANT AS R
  ON M.RESTAURANT_ID = R.RESTAURANT_ID
  WHERE O.CUSTOMER_ID = $1
  `,
  PLACE_ORDER_QUERY: `  
  WITH inserted_order AS (
    INSERT INTO APP_ORDER (customer_id, orderstatus) VALUES ($1, $2)
    RETURNING order_id
)
INSERT INTO ORDER_MENU (order_id,restaurant_id, menu_id, quantity)
SELECT 
    inserted_order.order_id,
	m.restaurant_id,
    cart_item.menu_id, 
    cart_item.quantity
FROM 
    inserted_order, cart_item
inner join 
	menu m
on m.menu_id = cart_item.menu_id
WHERE 
    cart_item.customer_id = $1;`,
  REMOVE_CART_ITEMS_QUERY: `
    DELETE FROM CART_ITEM WHERE CUSTOMER_ID = $1;
    `,
  CANCEL_ORDER_QUERY: ` 
    UPDATE APP_ORDER SET ORDERSTATUS = 'cancelled' WHERE ORDER_ID = $1;
    `,
  GET_ORDER_QUERY: `
    SELECT order_id, orderstatus from APP_ORDER WHERE ORDER_ID = $1 and customer_id = $2; 
    `,
  GET_ORDER_OWNER_QUERY: `
    SELECT O.ORDER_ID 
    FROM APP_ORDER O 
    INNER JOIN ORDER_MENU OM 
    ON O.ORDER_ID = OM.ORDER_ID
    INNER JOIN MENU M
    ON M.MENU_ID = OM.MENU_ID
    INNER JOIN RESTAURANT R
    ON R.RESTAURANT_ID = M.RESTAURANT_ID
    WHERE R.OWNER_ID = $1 AND O.ORDER_ID = $2;
    `,
  UPDATE_ORDER_QUERY: `
    UPDATE APP_ORDER SET ORDERSTATUS = $1 WHERE ORDER_ID = $2;
    `,
  ADD_REVIEW_QUERY: `
    INSERT INTO REVIEW (CUSTOMER_ID, RESTAURANT_ID, REVIEW, RATING) VALUES ($1, $2, $3, $4);
    `,
  CHECK_ORDER_QUERY: `
    SELECT O.ORDER_ID, O.CUSTOMER_ID,OM.RESTAURANT_ID
    FROM APP_ORDER O
    INNER JOIN ORDER_MENU OM
    ON OM.ORDER_ID = O.ORDER_ID
    WHERE O.CUSTOMER_ID = $1 AND OM.RESTAURANT_ID = $2;
    `,
};
