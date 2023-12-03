export interface Order {
  order_id: number;
  orderstatus: string;
  created_at: string;
  quantity: number;
  price: string;
  menu_name: string;
  description: string;
  restaurant_name: string;
}

type OrdersObject = { [key: number]: Order[] };

export function convertToOrdersObject(orders: Order[]): OrdersObject {
  const ordersObject: OrdersObject = {};

  orders.forEach((order) => {
    if (!ordersObject[order.order_id]) {
      ordersObject[order.order_id] = [];
    }
    ordersObject[order.order_id].push(order);
  });

  return ordersObject;
}
