import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");

    return;
  }

  // get code from body
  const { access_token } = req.body;

  if (!access_token) {
    res.status(400).send("Missing access_token");

    return;
  }

  // get user memberships
  const membershipConfig = {
    method: "get",
    url: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  const { data: response } = await axios(membershipConfig);

  const data = response.Response;

  const membershipType = data.destinyMemberships.find(
    (membership: any) => membership.membershipId === data.primaryMembershipId
  )?.membershipType;

  // get profile and character data
  const profileConfig = {
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${data.primaryMembershipId}/?components=200`,
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  const profileResponse = await axios(profileConfig);

  const profileData = profileResponse.data.Response;

  // combine data
  const combinedData = {
    ...data,
    ...profileData,
  };

  res.status(200).json(combinedData);
}
