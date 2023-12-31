import express, { Application, Request, Response } from "express";
import cors from "cors";
import customerRouter from "./routes/customer.route";
import adminRouter from "./routes/admin.route";
import ownerRouter from "./routes/owner.route";
import menuRouter from "./routes/menu.route";
import cartItemRouter from "./routes/cartItem.route";
import ordersRouter from "./routes/orders.route";
import restaurantRouter from "./routes/restaurant.route";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port: unknown = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/v1", (_req: Request, res: Response) => {
  res.send("khaled waleed");
});

app.use("/v1", customerRouter);
app.use("/v1", adminRouter);
app.use("/v1", ownerRouter);
app.use("/v1", restaurantRouter);
app.use("/v1", menuRouter);
app.use("/v1", cartItemRouter);
app.use("/v1", ordersRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
