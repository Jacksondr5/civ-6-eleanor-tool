// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { saveCityData } from "../../util/be-util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await saveCityData(req.body);
  res.status(200);
  res.end();
}
