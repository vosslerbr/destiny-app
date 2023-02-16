import {
  getInventoryItem,
  getStat,
  includeTables,
  load,
  setApiKey,
  setManifestsPath,
  verbose,
} from "@d2api/manifest-node";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
// import fs from "fs";

// This is how we keep some of the data we need up to date
// TODO eventually we should setup a cron to do this for us
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  verbose(); // make the client chatty. if you want.
  setApiKey(process.env.BUNGIE_API_KEY!);
  includeTables(["Vendor", "InventoryItem", "Stat"]);

  setManifestsPath(path.join(process.cwd(), "tmp", "manifests"));

  await load();

  console.log(process.env.BUNGIE_API_KEY);

  // fetch the latest Xur info
  const xurResponse = await fetch(
    "https://bungie.net/Platform/Destiny2/Vendors/?components=400,402,302,304",
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.BUNGIE_API_KEY!,
      },
    }
  );

  const xurResJson = await xurResponse.json();

  const xurSales = xurResJson.Response.sales.data[2190858386].saleItems; // The items Xur is selling

  const items = [];
  const unformattedItems = [];

  const xurSaleKEYS = Object.keys(xurSales);

  for (const key of xurSaleKEYS) {
    const item = xurSales[key];

    const itemHash = item.itemHash;

    const inventoryItem = getInventoryItem(itemHash);

    if (!inventoryItem || !inventoryItem.stats) continue;

    const formattedItem: {
      name: string;
      description: string;
      icon: string;
      screenshot: string;
      itemTypeAndTier: string;
      stats: any[];
    } = {
      name: inventoryItem.displayProperties.name,
      description: inventoryItem.displayProperties.description,
      icon: inventoryItem.displayProperties.icon,
      screenshot: inventoryItem.screenshot,
      itemTypeAndTier: inventoryItem.itemTypeAndTierDisplayName,
      stats: [],
    };

    const statHashes = Object.keys(inventoryItem.stats.stats);

    for (const hash of statHashes) {
      if (!hash) continue;

      const statName = getStat(hash);

      const statObj = {
        name: statName?.displayProperties.name,
        value: inventoryItem.stats.stats[parseInt(hash)].value,
      };

      formattedItem.stats.push(statObj);
    }

    items.push(formattedItem);
    unformattedItems.push(inventoryItem);
  }

  res.status(200).json({ xurSales, items, unformattedItems });
}
