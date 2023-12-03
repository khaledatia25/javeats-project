import { queryList } from "@/db/quiries.ts";
import Logger from "@/services/loggerService.ts";
import { RequestWithUser } from "@/types/user.types";
import query from "@db/connection.ts";
import { Response, Request } from "express";
const logger = new Logger("reviewsController");

export const addReview = async (req: RequestWithUser, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(500).send({ error: "something went wrong try again later" });
      return;
    }
    const { review, rating, restaurant_id } = req.body;
    if (
      typeof review !== "string" ||
      typeof rating !== "number" ||
      typeof restaurant_id !== "number"
    ) {
      res
        .status(500)
        .send({ error: "review, rating and restaurant_id must be provided" });
      return;
    }
    // check if user has ordered from this restaurant
    const checkOrderQuery = queryList.CHECK_ORDER_QUERY as string;
    const checkResult = await query(checkOrderQuery, [user.id, restaurant_id]);
    if (checkResult.rowCount === 0) {
      res.status(500).send({
        error: "You must order from this restaurant to add a review",
      });
      return;
    }
    // add review
    const addReviewQuery = queryList.ADD_REVIEW_QUERY as string;
    const result = await query(addReviewQuery, [
      user.id,
      restaurant_id,
      review,
      rating,
    ]);
    console.log(result);
    logger.info(
      `An customer with id = ${user.id} and email = ${user.email} has added a review`
    );
    res.status(200).send({ message: "review added successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(id)) {
      res.status(500).send({ error: "id must be provided" });
      return;
    }
    const restaurant_id = parseInt(id);
    // get all reviews for a restaurant
    const getReviewsQuery = queryList.GET_REVIEWS_QUERY as string;
    const result = await query(getReviewsQuery, [restaurant_id]);
    if (result.rowCount === 0) {
      res.status(200).send({ reviews: [], averageRating: 0 });
      return;
    }
    // get average rating
    const getAverageRatingQuery = queryList.GET_AVERAGE_RATING_QUERY as string;
    const averageRatingResult = await query(getAverageRatingQuery, [
      restaurant_id,
    ]);
    const averageRating = averageRatingResult.rows[0].average_rating;
    res.status(200).send({ reviews: result.rows, averageRating });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "something went wrong try again later" });
  }
};
