import itemTypeMap from "@/helpers/itemTypeMap";
import prisma from "@/lib/prisma";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// TODO this route is slow, need to figure out how to speed it up. Takes about 6 seconds to load right now

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  // fetch the latest Xur info, the manifest doesn't have this info
  const xurResponse = await axios.get(
    "https://bungie.net/Platform/Destiny2/Vendors/?components=400,402,302,304",
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.BUNGIE_API_KEY!,
      },
    }
  );

  const { data: xurResJson } = xurResponse;

  const xurSales = xurResJson.Response.sales.data[2190858386].saleItems; // The items Xur is selling

  const items = [];
  const unformattedItems = [];

  const xurSaleKEYS = Object.keys(xurSales);

  const xur = await prisma.vendor.findUnique({
    where: {
      hash: 2190858386,
    },
  });

  for (const key of xurSaleKEYS) {
    const item = xurSales[key];

    const itemHash = item.itemHash;

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: {
        hash: itemHash,
      },
      include: {
        stats: true,
      },
    });

    if (!inventoryItem || !inventoryItem.stats) continue;

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
      hash: inventoryItem.hash,
      collectibleHash: inventoryItem.collectibleHash,
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
      stats: {},
    };

    items.push(formattedItem);
    unformattedItems.push(inventoryItem);
  }

  res.status(200).json({
    xur: { keyart: xur?.specialImage, name: xur?.name },
    xurSales,
    items,
    unformattedItems,
  });
}
