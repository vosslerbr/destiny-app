import { getInventoryItem, includeTables, load, setApiKey, verbose } from "@d2api/manifest-node";
import type { NextApiRequest, NextApiResponse } from "next";
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
  includeTables(["InventoryItem"]);

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

  const xurSales = xurResJson.Response.sales.data[2190858386].saleItems;

  const items = [];

  const xurSaleKEYS = Object.keys(xurSales);

  for (const key of xurSaleKEYS) {
    const item = xurSales[key];

    const itemHash = item.itemHash;

    // if you made it to this comment, the manifest is ready for use!

    const res = getInventoryItem(itemHash);

    items.push(res);
  }

  res.status(200).json({ xurSales, items });
}
