import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");

    return;
  }

  // get code from body
  const { access_token } = req.body;

  console.log("access_token", access_token);

  if (!access_token) {
    res.status(400).send("Missing access_token");

    return;
  }

  const config = {
    method: "get",
    url: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  console.log("config", config);

  const { data: response } = await axios(config);

  // console.log("data: ", response);

  res.status(200).json(response.Response);
}
