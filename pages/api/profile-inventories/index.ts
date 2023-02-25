import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");

    return;
  }

  console.log("req.body", req.body);

  // get membership id from query string
  const { membershipId, access_token } = req.body;

  console.log("membershipId", membershipId);

  if (!membershipId) {
    res.status(400).send("Missing membershipId");

    return;
  }

  const config = {
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/1/Profile/${membershipId}/?components=102, 201,800`,
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  console.log("config", config);

  const response = await axios(config);

  const data = response.data.Response;

  const combinedInventory = [...data.profileInventory.data.items];

  const characterIds = Object.keys(data.characterInventories.data);

  characterIds.forEach((characterId) => {
    const characterInventory = data.characterInventories.data[characterId].items;

    combinedInventory.push(...characterInventory);
  });

  const collectibleStates = data.characterCollectibles.data[characterIds[0]].collectibles;

  // console.log("data: ", response);

  res.status(200).json({ combinedInventory, collectibleStates });
}
