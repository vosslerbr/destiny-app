import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");

    return;
  }

  // get code from body
  const { code } = req.body;

  console.log("code", code);

  if (!code) {
    res.status(400).send("Missing code");

    return;
  }

  const data = qs.stringify({
    // eslint-disable-next-line
    grant_type: "authorization_code",
    code,
  });

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
    data: data,
  };

  console.log("config", config);

  const { data: response } = await axios(config);

  res.status(200).json(response);
}
