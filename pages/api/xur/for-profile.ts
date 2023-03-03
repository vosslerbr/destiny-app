import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import prisma from "@/lib/prisma";
import itemTypeMap from "@/helpers/itemTypeMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // get data from request body
  const { membershipType, membershipId, access_token, characterId } = req.body;

  const missingMembershipType = membershipType === undefined || membershipType === null; // 0 is a valid membership type

  if (!membershipId || missingMembershipType || !access_token || !characterId) {
    res.status(400).json({
      message: "Membership ID, Membership Type, Access Token, and Character Id are all required",
      success: false,
    });
    return;
  }

  const xurVendorHash = 2190858386;

  const xur = await prisma.vendor.findUnique({
    where: {
      hash: xurVendorHash,
    },
  });

  const xurConfig = {
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/Character/${characterId}/Vendors/${xurVendorHash}/?components=402,304`,
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  const xurResponse = await axios(xurConfig);

  const xurData = xurResponse.data.Response;

  const xurSalesKeys = Object.keys(xurData.sales.data);

  // combine with stats
  const combinedItems = xurSalesKeys.reduce((acc: any[], curr) => {
    const item = xurData.sales.data[curr];
    const itemStats = xurData.itemComponents.stats.data[curr];

    acc.push({ ...item, stats: itemStats });

    return acc;
  }, []);

  // TODO actually get the item and its stats

  const items = [];

  for (const item of combinedItems) {
    const hash: number = item.itemHash;

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: {
        hash,
      },
    });

    if (!inventoryItem) continue;

    const stats = item?.stats?.stats || {};

    const statHashes = Object.keys(stats);

    const itemStats: { [key: string]: any } = {};

    // create a promise for each statHash so we can use Promise.all

    const statPromises = statHashes.map(async (statHash) => {
      const stat = stats[statHash]; // get the stat

      const numberHash = parseInt(statHash); // convert the statHash to a number

      const statDefinition = await prisma.stat.findUnique({
        where: {
          hash: numberHash,
        },
      });

      if (!statDefinition) return;

      itemStats[statDefinition?.name || statHash] = { value: stat.value };
    });

    await Promise.all(statPromises);

    const summaryInventoryItem = inventoryItem.summaryItemHash
      ? await prisma.inventoryItem.findUnique({
          where: {
            hash: inventoryItem.summaryItemHash,
          },
        })
      : null;

    const formattedItem: {
      hash: number;
      collectibleHash: number | null;
      name: string;
      description: string;
      icon: string;
      screenshot: string;
      itemTypeAndTier: string;
      itemType: string;
      itemTier: string;
      classType: number | null;
      stats: any;
    } = {
      hash,
      collectibleHash: inventoryItem.collectibleHash || null,
      name: inventoryItem.name || "",
      description: inventoryItem.description || "",
      icon: inventoryItem.icon || "",
      screenshot: inventoryItem.screenshot || "",
      itemTypeAndTier: inventoryItem.itemTypeAndTierDisplayName || "",
      itemType:
        typeof inventoryItem.itemType === "number"
          ? itemTypeMap[inventoryItem.itemType].singular
          : "",
      itemTier: summaryInventoryItem?.name || "",
      classType: inventoryItem.classType,
      stats: itemStats,
    };

    items.push(formattedItem);
  }

  res.status(200).json({
    xur: { keyart: xur?.specialImage, name: xur?.name },
    items,
  });
}
