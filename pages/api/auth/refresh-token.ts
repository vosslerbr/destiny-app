import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");

    return;
  }

  console.log("req.body", req.body);

  // get code from body
  const { refresh_token } = req.body;

  console.log("refresh_token", refresh_token);

  if (!refresh_token) {
    res.status(400).send("Missing refresh_token");

    return;
  }

  const queryParams = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });

  console.log("queryParams: ", queryParams);

  const config = {
    method: "post",
    url: "https://www.bungie.net/Platform/App/OAuth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.BUNGIE_APP_CLIENT_ID!,
      password: process.env.BUNGIE_APP_CLIENT_SECRET!,
    },
    data: queryParams.toString(),
  };

  console.log("config", config);

  const { data: response } = await axios(config);

  // console.log("data: ", response);

  res.status(200).json(response);
}