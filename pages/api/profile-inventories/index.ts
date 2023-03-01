import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // get membership id from query string
  const { membershipType, membershipId, access_token } = req.body;

  if (!membershipId) {
    res.status(400).json({ message: "Membership id is required", success: false });

    return;
  }

  const config = {
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=102, 201,800`,
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  const response = await axios(config);

  const data = response.data.Response;

  const combinedInventory = [...data.profileInventory.data.items];

  const characterIds = Object.keys(data.characterInventories.data);

  characterIds.forEach((characterId) => {
    const characterInventory = data.characterInventories.data[characterId].items;

    combinedInventory.push(...characterInventory);
  });

  const collectibleStates = data.characterCollectibles.data[characterIds[0]].collectibles;

  res.status(200).json({ combinedInventory, collectibleStates });
}
