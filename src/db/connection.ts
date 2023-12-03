import pool from "./pool.ts";
import { QueryResult } from "pg";

const query = (
  queryText: string,
  queryParams: (string | number)[]
): Promise<QueryResult> => {
  return new Promise((resolve, reject) => {
    pool
      .query(queryText, queryParams)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export default query;
