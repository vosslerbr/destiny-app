import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // get code from body
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ message: "Code is required", success: false });

    return;
  }

  const queryParams = new URLSearchParams({
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
    data: queryParams.toString(),
  };

  const { data: response } = await axios(config);

  res.status(200).json(response);
}
