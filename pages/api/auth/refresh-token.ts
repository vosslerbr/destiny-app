import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // get code from body
  const { refresh_token } = req.body;

  if (!refresh_token) {
    res.status(400).json({ message: "Refresh token is required", success: false });

    return;
  }

  const queryParams = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
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
    data: queryParams.toString(),
  };

  const { data: response } = await axios(config);

  res.status(200).json(response);
}
